import {
  Badge,
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
import { Meta, PageResp } from "~/types";

const Metas = () => {
  const t = useT();
  useManageTitle("manage.sidemenu.metas");
  const { to } = useRouter();
  const [getMetasLoading, getMetas] = useFetch(() => r.get("/admin/meta/list"));
  const [metas, setMetas] = createSignal<Meta[]>([]);
  const refresh = async () => {
    const resp: PageResp<Meta> = await getMetas();
    handleRresp(resp, (data) => setMetas(data.content));
  };
  refresh();

  const [deleting, deleteMeta] = useListFetch((id: number) =>
    r.post(`/admin/meta/delete?id=${id}`)
  );
  return (
    <VStack spacing="$2" alignItems="start" w="$full">
      <HStack spacing="$2">
        <Button
          colorScheme="accent"
          loading={getMetasLoading()}
          onClick={refresh}
        >
          {t("global.refresh")}
        </Button>
        <Button
          onClick={() => {
            to("/@manage/metas/add");
          }}
        >
          {t("global.add")}
        </Button>
      </HStack>
      <Box w="$full" overflowX="auto">
        <Table highlightOnHover dense>
          <Thead>
            <Tr>
              <For each={["path", "password", "write", "hide"]}>
                {(title) => <Th>{t(`metas.${title}`)}</Th>}
              </For>
              <Th>{t("global.operations")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            <For each={metas()}>
              {(meta) => (
                <Tr>
                  <Td>{meta.path}</Td>
                  <Td>{meta.password}</Td>
                  <Td>{meta.write}</Td>
                  <Td>{meta.hide}</Td>
                  <Td>
                    <HStack spacing="$2">
                      <Button
                        onClick={() => {
                          to(`/@manage/metas/edit/${meta.id}`);
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
                                  name: meta.path,
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
                                    loading={deleting() === meta.id}
                                    onClick={async () => {
                                      const resp = await deleteMeta(meta.id);
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

export default Metas;
