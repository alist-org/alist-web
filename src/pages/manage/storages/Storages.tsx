import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@hope-ui/solid";
import { createSignal, For } from "solid-js";
import {
  useFetch,
  useListFetch,
  useManageTitle,
  useRouter,
  useT,
} from "~/hooks";
import { handleRresp, notify, r } from "~/utils";
import { PageResp, Storage } from "~/types";

const Storages = () => {
  const t = useT();
  useManageTitle("manage.sidemenu.storages");
  const { to } = useRouter();
  const [getStoragesLoading, getStorages] = useFetch(() =>
    r.get("/admin/storage/list")
  );
  const [storages, setStorages] = createSignal<Storage[]>([]);
  const refresh = async () => {
    const resp: PageResp<Storage> = await getStorages();
    handleRresp(resp, (data) => setStorages(data.content));
  };
  refresh();

  const [deleting, deleteStorage] = useListFetch((id: number) =>
    r.post(`/admin/storage/delete?id=${id}`)
  );
  return (
    <VStack spacing="$2" alignItems="start" w="$full">
      <HStack spacing="$2">
        <Button
          colorScheme="accent"
          loading={getStoragesLoading()}
          onClick={refresh}
        >
          {t("global.refresh")}
        </Button>
        <Button
          onClick={() => {
            to("/@manage/storages/add");
          }}
        >
          {t("global.add")}
        </Button>
      </HStack>
      <Box w="$full" overflowX="auto">
        <Table highlightOnHover dense>
          <Thead>
            <Tr>
              <For each={["mount_path", "driver", "index", "status", "remark"]}>
                {(title) => <Th>{t(`storages.common.${title}`)}</Th>}
              </For>
              <Th>{t("global.operations")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            <For each={storages()}>
              {(storage) => (
                <Tr>
                  <Td>{storage.mount_path}</Td>
                  <Td>{storage.driver}</Td>
                  <Td>{storage.index}</Td>
                  <Td>{storage.status}</Td>
                  <Td>{storage.remark}</Td>
                  <Td>
                    <HStack spacing="$2">
                      <Button
                        onClick={() => {
                          to(`/@manage/storages/edit/${storage.id}`);
                        }}
                      >
                        {t("global.edit")}
                      </Button>
                      <Popover>
                        {({ onClose }) => (
                          <>
                            <PopoverTrigger as={Button} colorScheme="danger">
                              {t("global.delete")}
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverHeader>
                                {t("global.delete_confirm", {
                                  name: storage.mount_path,
                                })}
                              </PopoverHeader>
                              <PopoverBody>
                                <HStack spacing="$2">
                                  <Button
                                    onClick={onClose}
                                    colorScheme="neutral"
                                  >
                                    {t("global.cancel")}
                                  </Button>
                                  <Button
                                    colorScheme="danger"
                                    loading={deleting() === storage.id}
                                    onClick={async () => {
                                      const resp = await deleteStorage(
                                        storage.id
                                      );
                                      handleRresp(resp, () => {
                                        notify.success(
                                          t("global.delete_success")
                                        );
                                        refresh();
                                      });
                                    }}
                                  >
                                    {t("global.confirm")}
                                  </Button>
                                </HStack>
                              </PopoverBody>
                            </PopoverContent>
                          </>
                        )}
                      </Popover>
                    </HStack>
                  </Td>
                </Tr>
              )}
            </For>
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default Storages;
