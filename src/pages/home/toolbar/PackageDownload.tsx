import "~/utils/zip-stream.js"
import streamSaver from "streamsaver"
import { getLinkByDirAndObj, useRouter, useT } from "~/hooks"
import { fsList, pathBase, pathJoin } from "~/utils"
import { password, selectedObjs as _selectedObjs } from "~/store"
import { createSignal, For, Show } from "solid-js"
import {
  Button,
  Heading,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@hope-ui/solid"
import { Obj } from "~/types"

streamSaver.mitm = "/streamer/mitm.html"
const trimSlash = (str: string) => {
  return str.replace(/^\/+|\/+$/g, "")
}

let totalSize = 0
interface File {
  path: string
  url: string
}

const PackageDownload = (props: { onClose: () => void }) => {
  const t = useT()
  const [cur, setCur] = createSignal(t("home.package_download.initializing"))
  // 0: init
  // 1: error
  // 2: fetching structure
  // 3: fetching files
  // 4: success
  const [status, setStatus] = createSignal(0)
  const { pathname } = useRouter()
  const selectedObjs = _selectedObjs()
  // if (!selectedObjs.length) {
  //   notify.warning(t("home.toolbar.no_selected"));
  // }
  const fetchFolderStructure = async (
    pre: string,
    obj: Obj,
  ): Promise<File[] | string> => {
    if (!obj.is_dir) {
      totalSize += obj.size
      return [
        {
          path: pathJoin(pre, obj.name),
          url: getLinkByDirAndObj(
            pathJoin(pathname(), pre),
            obj,
            "direct",
            true,
          ),
        },
      ]
    } else {
      const resp = await fsList(pathJoin(pathname(), pre, obj.name), password())
      if (resp.code !== 200) {
        return resp.message
      }
      const res: File[] = []
      for (const _obj of resp.data.content ?? []) {
        const _res = await fetchFolderStructure(pathJoin(pre, obj.name), _obj)
        if (typeof _res === "string") {
          return _res
        } else {
          res.push(..._res)
        }
      }
      return res
    }
  }
  const [fetchings, setFetchings] = createSignal<string[]>([])
  const run = async () => {
    let saveName = pathBase(pathname())
    if (selectedObjs.length === 1) {
      saveName = selectedObjs[0].name
    }
    if (!saveName) {
      saveName = t("manage.sidemenu.home")
    }
    let fileStream = streamSaver.createWriteStream(`${saveName}.zip`, {
      size: totalSize,
    })
    setCur(t("home.package_download.fetching_struct"))
    setStatus(2)
    const downFiles: File[] = []
    for (const obj of selectedObjs) {
      const res = await fetchFolderStructure("", obj)
      if (typeof res === "string") {
        setCur(`${t("home.package_download.fetching_struct_failed")}: ${res}`)
        setStatus(1)
        return res
      } else {
        downFiles.push(...res)
      }
    }
    setCur(t("home.package_download.downloading"))
    setStatus(3)
    let fileArr = downFiles.values()
    let readableZipStream = new (window as any).ZIP({
      pull(ctrl: any) {
        const it = fileArr.next()
        if (it.done) {
          ctrl.close()
        } else {
          let name = trimSlash(it.value.path)
          if (selectedObjs.length === 1) {
            name = name.replace(`${saveName}/`, "")
          }
          const url = it.value.url
          // console.log(name, url);
          return fetch(url).then((res) => {
            setFetchings((prev) => [...prev, name])
            ctrl.enqueue({
              name,
              stream: res.body,
            })
          })
        }
      },
    })
    if (window.WritableStream && readableZipStream.pipeTo) {
      return readableZipStream
        .pipeTo(fileStream)
        .then(() => {
          setCur(`${t("home.package_download.success")}`)
          setStatus(4)
        })
        .catch((err: any) => {
          setCur(`${t("home.package_download.failed")}: ${err}`)
          setStatus(1)
        })
    }
  }
  run()

  return (
    <>
      <ModalBody>
        <VStack w="$full" alignItems="start" spacing="$2">
          <Heading>
            {t(`home.package_download.current_status`)}: {cur()}
          </Heading>
          <For each={fetchings()}>
            {(name) => (
              <Text
                css={{
                  wordBreak: "break-all",
                }}
              >
                Fetching: {name}
              </Text>
            )}
          </For>
        </VStack>
      </ModalBody>
      <Show when={[1, 4].includes(status())}>
        <ModalFooter>
          <Button colorScheme="info" onClick={props.onClose}>
            {t("global.close")}
          </Button>
        </ModalFooter>
      </Show>
    </>
  )
}

export default PackageDownload
