import {
  VStack,
  Input,
  Heading,
  HStack,
  IconButton,
  Checkbox,
  Text,
  Badge,
  Progress,
  ProgressIndicator,
  Button,
} from "@hope-ui/solid";
import { createSignal, For, Show } from "solid-js";
import { useRouter, useT } from "~/hooks";
import { getMainColor } from "~/store";
import {
  RiDocumentFolderUploadFill,
  RiDocumentFileUploadFill,
} from "solid-icons/ri";
import { getFileSize, notify, pathJoin, r } from "~/utils";
import { asyncPool } from "~/utils/async_pool";
import { createStore } from "solid-js/store";
import { Resp } from "~/types";

type Status = "pending" | "uploading" | "backending" | "success" | "error";
interface UploadFileProps {
  name: string;
  path: string;
  size: number;
  progress: number;
  speed: number;
  status: Status;
  msg?: string;
}
const StatusBadge = {
  pending: "neutral",
  uploading: "info",
  backending: "info",
  success: "success",
  error: "danger",
} as const;

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const traverseFileTree = async (entry: FileSystemEntry) => {
  let res: File[] = [];
  const internalProcess = async (entry: FileSystemEntry, path: string) => {
    const promise = new Promise<{}>((resolve) => {
      const errorCallback: ErrorCallback = (e) => {
        console.error(e);
        resolve({});
      };
      if (entry.isFile) {
        (entry as FileSystemFileEntry).file((file) => {
          const newFile = new File([file], path + file.name, {
            type: file.type,
          });
          res.push(newFile);
          console.log(newFile);
          resolve({});
        }, errorCallback);
      } else if (entry.isDirectory) {
        const dirReader = (entry as FileSystemDirectoryEntry).createReader();
        dirReader.readEntries(async (entries) => {
          for (let i = 0; i < entries.length; i++) {
            await internalProcess(entries[i], path + entry.name + "/");
          }
          resolve({});
        }, errorCallback);
      }
    });
    await promise;
  };
  await internalProcess(entry, "");
  return res;
};

const UploadFile = (props: UploadFileProps) => {
  const t = useT();
  return (
    <VStack
      w="$full"
      spacing="$1"
      rounded="$lg"
      border="1px solid $neutral7"
      alignItems="start"
      p="$2"
      _hover={{
        border: `1px solid ${getMainColor()}`,
      }}
    >
      <Text
        css={{
          wordBreak: "break-all",
        }}
      >
        {props.path}
      </Text>
      <HStack spacing="$2">
        <Badge colorScheme={StatusBadge[props.status]}>
          {t(`home.upload.${props.status}`)}
        </Badge>
        <Text>{getFileSize(props.speed)}/s</Text>
      </HStack>
      <Progress
        w="$full"
        trackColor="$info3"
        rounded="$full"
        value={props.progress}
        size="sm"
      >
        <ProgressIndicator color={getMainColor()} rounded="$md" />
        {/* <ProgressLabel /> */}
      </Progress>
      <Text color="$danger10">{props.msg}</Text>
    </VStack>
  );
};

const File2Upload = (file: File): UploadFileProps => {
  return {
    name: file.name,
    path: file.webkitRelativePath === "" ? file.name : file.webkitRelativePath,
    size: file.size,
    progress: 0,
    speed: 0,
    status: "pending",
  };
};

const Upload = () => {
  const t = useT();
  const { pathname } = useRouter();
  const [drag, setDrag] = createSignal(false);
  const [uploading, setUploading] = createSignal(false);
  const [asTask, setAsTask] = createSignal(false);
  const [uploads, setUploads] = createStore<{ uploads: UploadFileProps[] }>({
    uploads: [],
  });
  const allDone = () => {
    return uploads.uploads.every(({ status }) =>
      ["success", "error"].includes(status)
    );
  };
  let fileInput: HTMLInputElement;
  let folderInput: HTMLInputElement;
  const hanldAddFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      const upload = File2Upload(file);
      setUploads("uploads", (uploads) => [...uploads, upload]);
    }
    for await (const ms of asyncPool(3, files, handleFile)) {
      console.log(ms);
    }
  };
  const setUpload = (path: string, key: keyof UploadFileProps, value: any) => {
    setUploads("uploads", (upload) => upload.path === path, key, value);
  };
  const handleFile = async (file: File) => {
    const path =
      file.webkitRelativePath === "" ? file.name : file.webkitRelativePath;
    setUpload(path, "status", "uploading");
    const uploadPath = pathJoin(pathname(), path);
    let oldTimestamp = new Date().valueOf();
    let oldLoaded = 0;
    try {
      const resp: Resp<{}> = await r.put("/fs/put", await file.arrayBuffer(), {
        headers: {
          "File-Path": encodeURIComponent(uploadPath),
          "As-Task": asTask(),
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const complete =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            setUpload(path, "progress", complete);

            const timestamp = new Date().valueOf();
            const duration = (timestamp - oldTimestamp) / 1000;
            if (duration > 1) {
              const loaded = progressEvent.loaded - oldLoaded;
              const speed = loaded / duration;
              const remain = progressEvent.total - progressEvent.loaded;
              const remainTime = remain / speed;
              setUpload(path, "speed", speed);
              console.log(remainTime);

              oldTimestamp = timestamp;
              oldLoaded = progressEvent.loaded;
            }

            if (complete === 100) {
              setUpload(path, "status", "backending");
            }
          }
        },
      });
      if (resp.code === 200) {
        setUpload(path, "status", "success");
        setUpload(path, "progress", 100);
      } else {
        setUpload(path, "status", "error");
        setUpload(path, "msg", resp.message);
      }
    } catch (e: any) {
      console.error(e);
      setUpload(path, "status", "error");
      setUpload(path, "msg", e.message);
    }
  };
  return (
    <VStack w="$full" pb="$2" spacing="$2">
      <Show
        when={!uploading()}
        fallback={
          <>
            <HStack spacing="$2">
              <Button
                colorScheme="accent"
                onClick={() => {
                  setUploads("uploads", (_uploads) =>
                    _uploads.filter(
                      ({ status }) => !["success", "error"].includes(status)
                    )
                  );
                  console.log(uploads.uploads);
                }}
              >
                {t("home.upload.clear_done")}
              </Button>
              <Show when={allDone()}>
                <Button
                  onClick={() => {
                    setUploading(false);
                  }}
                >
                  {t("home.upload.back")}
                </Button>
              </Show>
            </HStack>
            <For each={uploads.uploads}>
              {(upload) => <UploadFile {...upload} />}
            </For>
          </>
        }
      >
        <Input
          type="file"
          multiple
          ref={fileInput!}
          display="none"
          onChange={(e) => {
            // @ts-ignore
            hanldAddFiles(Array.from(e.target.files ?? []));
          }}
        />
        <Input
          type="file"
          multiple
          // @ts-ignore
          webkitdirectory
          ref={folderInput!}
          display="none"
          onChange={(e) => {
            // @ts-ignore
            hanldAddFiles(Array.from(e.target.files ?? []));
          }}
        />
        <VStack
          w="$full"
          justifyContent="center"
          border={`2px dashed ${drag() ? getMainColor() : "$neutral8"}`}
          rounded="$lg"
          onDragOver={(e: DragEvent) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => {
            setDrag(false);
          }}
          onDrop={async (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDrag(false);
            const res: File[] = [];
            const items = Array.from(e.dataTransfer?.items ?? []);
            const files = Array.from(e.dataTransfer?.files ?? []);
            let foldersCount = 0;
            let itemLength = items.length;
            for (let i = 0; i < itemLength; i++) {
              if (foldersCount > 0) {
                notify.warning(t("home.upload.only_files_or_one_folder"));
                return;
              }
              const item = items[i];
              const entry = item.webkitGetAsEntry();
              console.log(entry);
              if (entry?.isFile) {
                res.push(files[i]);
              } else if (entry?.isDirectory) {
                res.push(...(await traverseFileTree(entry)));
                foldersCount++;
              }
            }
            if (foldersCount > 0 && itemLength > 1) {
              notify.warning(t("home.upload.only_files_or_one_folder"));
              return;
            }
            if (res.length === 0) {
              notify.warning(t("home.upload.no_files_drag"));
            }
            hanldAddFiles(res);
          }}
          spacing="$4"
          // py="$4"
          h="$48"
        >
          <Show
            when={!drag()}
            fallback={<Heading>{t("home.upload.release")}</Heading>}
          >
            <Heading>{t("home.upload.upload-tips")}</Heading>
            <HStack spacing="$4">
              <IconButton
                compact
                size="xl"
                aria-label={t("home.upload.upload_folder")}
                colorScheme="accent"
                icon={<RiDocumentFolderUploadFill />}
                onClick={() => {
                  folderInput.click();
                }}
              />
              <IconButton
                compact
                size="xl"
                aria-label={t("home.upload.upload_files")}
                icon={<RiDocumentFileUploadFill />}
                onClick={() => {
                  fileInput.click();
                }}
              />
            </HStack>
            <Checkbox
              checked={asTask()}
              onChange={() => {
                setAsTask(!asTask());
              }}
            >
              {t("home.upload.add_as_task")}
            </Checkbox>
          </Show>
        </VStack>
      </Show>
    </VStack>
  );
};

export default Upload;
