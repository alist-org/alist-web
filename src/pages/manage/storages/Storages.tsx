import { Button, Grid, HStack, VStack } from "@hope-ui/solid"
import { createSignal, For } from "solid-js"
import { useFetch, useManageTitle, useRouter, useT } from "~/hooks"
import { handleResp, r } from "~/utils"
import { PageResp, Storage } from "~/types"
import { StorageC } from "./Storage"

const Storages = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.storages")
  const { to } = useRouter()
  const [getStoragesLoading, getStorages] = useFetch(
    (): Promise<PageResp<Storage>> => r.get("/admin/storage/list")
  )
  const [storages, setStorages] = createSignal<Storage[]>([])
  const refresh = async () => {
    const resp = await getStorages()
    handleResp(resp, (data) => setStorages(data.content))
  }
  refresh()

  // const [deleting, deleteStorage] = useListFetch(
  //   (id: number): Promise<EmptyResp> => r.post(`/admin/storage/delete?id=${id}`)
  // )
  // const [enableOrDisableLoading, enableOrDisable] = useListFetch(
  //   (id: number, storage?: Storage): Promise<EmptyResp> =>
  //     r.post(
  //       `/admin/storage/${storage?.disabled ? "enable" : "disable"}?id=${
  //         storage?.id
  //       }`
  //     )
  // )
  return (
    <VStack spacing="$3" alignItems="start" w="$full">
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
            to("/@manage/storages/add")
          }}
        >
          {t("global.add")}
        </Button>
      </HStack>
      <Grid
        w="$full"
        gap="$2_5"
        templateColumns={{
          "@initial": "1fr",
          "@lg": "repeat(auto-fill, minmax(324px, 1fr))",
        }}
      >
        <For each={storages()}>
          {(storage) => <StorageC storage={storage} refresh={refresh} />}
        </For>
      </Grid>
      {/* <Box w="$full" overflowX="auto">
        <Table highlightOnHover dense>
          <Thead>
            <Tr>
              <For each={["mount_path", "driver", "order", "status", "remark"]}>
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
                  <Td>{t(`drivers.drivers.${storage.driver}`)}</Td>
                  <Td>{storage.order}</Td>
                  <Td>{storage.status}</Td>
                  <Td>{storage.remark}</Td>
                  <Td>
                    <HStack spacing="$2">
                      <Button
                        onClick={() => {
                          to(`/@manage/storages/edit/${storage.id}`)
                        }}
                      >
                        {t("global.edit")}
                      </Button>
                      <Button
                        loading={enableOrDisableLoading() === storage.id}
                        colorScheme="warning"
                        onClick={async () => {
                          const resp = await enableOrDisable(
                            storage.id,
                            storage
                          )
                          handleRespWithNotifySuccess(resp, () => {
                            refresh()
                          })
                        }}
                      >
                        {t(`global.${storage.disabled ? "enable" : "disable"}`)}
                      </Button>
                      <DeletePopover
                        name={storage.mount_path}
                        loading={deleting() === storage.id}
                        onClick={async () => {
                          const resp = await deleteStorage(storage.id)
                          handleResp(resp, () => {
                            notify.success(t("global.delete_success"))
                            refresh()
                          })
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              )}
            </For>
          </Tbody>
        </Table>
      </Box> */}
    </VStack>
  )
}

export default Storages
