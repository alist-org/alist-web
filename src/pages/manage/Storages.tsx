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
import { useLoading, useT } from "~/hooks";
import { notify, r } from "~/utils";
import { PageResp, Storage } from "~/types";

const Storages = () => {
  const t = useT();
  const [getStoragesLoading, getStorages] = useLoading(() =>
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
          {t("manage.storages.refresh")}
        </Button>
        <Button>{t("manage.storages.add")}</Button>
      </HStack>
      <Box w="$full" overflowX="auto">
        <Table highlightOnHover>
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
                {(title) => <Th>{t(`manage.storages.${title}`)}</Th>}
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
                      <Button>{t("manage.edit")}</Button>
                      <Button colorScheme="danger">{t("manage.delete")}</Button>
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
