import {
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@hope-ui/solid";
import { createSignal, For } from "solid-js";
import { useFetch, useRouter, useT } from "~/hooks";
import { notify, r } from "~/utils";
import { PageResp, Storage } from "~/types";

const Storages = () => {
  const t = useT();
  const { to } = useRouter();
  const [getStoragesLoading, getStorages] = useFetch(() =>
    r.get("/admin/storage/list")
  );
  const [storages, setStorages] = createSignal<Storage[]>([]);
  const refresh = async () => {
    const resp: PageResp<Storage> = await getStorages();
    if (resp.code === 200) {
      setStorages(resp.data.content);
    } else {
      notify.error(resp.message);
    }
  };
  refresh();
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
              <For
                each={[
                  "mount_path",
                  "driver",
                  "index",
                  "status",
                  "remark",
                  "operations",
                ]}
              >
                {(title) => <Th>{t(`storages.${title}`)}</Th>}
              </For>
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
                    <HStack spacing="$1">
                      <Button
                        onClick={() => {
                          to(`/@manage/storages/edit/${storage.id}`);
                        }}
                      >
                        {t("global.edit")}
                      </Button>
                      <Button colorScheme="danger">{t("global.delete")}</Button>
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
