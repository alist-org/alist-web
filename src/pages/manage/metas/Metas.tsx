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
} from "@hope-ui/solid"
import { createSignal, For } from "solid-js"
import {
  useFetch,
  useListFetch,
  useManageTitle,
  useRouter,
  useT,
} from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { Meta, PageResp } from "~/types"
import { DeletePopover } from "../common/DeletePopover"
import { Wether } from "~/components"

const Metas = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.metas")
  const { to } = useRouter()
  const [getMetasLoading, getMetas] = useFetch(() => r.get("/admin/meta/list"))
  const [metas, setMetas] = createSignal<Meta[]>([])
  const refresh = async () => {
    const resp: PageResp<Meta> = await getMetas()
    handleResp(resp, (data) => setMetas(data.content))
  }
  refresh()

  const [deleting, deleteMeta] = useListFetch((id: number) =>
    r.post(`/admin/meta/delete?id=${id}`),
  )
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
            to("/@manage/metas/add")
          }}
        >
          {t("global.add")}
        </Button>
      </HStack>
      <Box w="$full" overflowX="auto">
        <Table highlightOnHover dense>
          <Thead>
            <Tr>
              <For each={["path", "password", "write"]}>
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
                  <Td>
                    <Wether yes={meta.write} />
                  </Td>
                  {/* <Td>{meta.hide}</Td> */}
                  <Td>
                    <HStack spacing="$2">
                      <Button
                        onClick={() => {
                          to(`/@manage/metas/edit/${meta.id}`)
                        }}
                      >
                        {t("global.edit")}
                      </Button>
                      <DeletePopover
                        name={meta.path}
                        loading={deleting() === meta.id}
                        onClick={async () => {
                          const resp = await deleteMeta(meta.id)
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
      </Box>
    </VStack>
  )
}

export default Metas
