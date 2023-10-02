import {
  Button,
  Checkbox,
  Switch as HopeSwitch,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Flex,
  Textarea,
  FormHelperText,
} from "@hope-ui/solid"
import { MaybeLoading, FolderChooseInput } from "~/components"
import { useFetch, useRouter, useT } from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { Meta, PEmptyResp, PResp } from "~/types"
import { createStore } from "solid-js/store"
import { For, Show } from "solid-js"

type ItemProps = {
  name: string
  sub?: boolean
  onSub: (val: boolean) => void
  help?: boolean
} & (
  | { type: "string"; value: string; onChange: (val: string) => void }
  | { type: "text"; value: string; onChange: (val: string) => void }
  | { type: "bool"; value: boolean; onChange: (val: boolean) => void }
)
const Item = (props: ItemProps) => {
  const t = useT()
  return (
    <FormControl w="$full" display="flex" flexDirection="column">
      <FormLabel for={props.name} display="flex" alignItems="center">
        {t(`metas.${props.name}`)}
      </FormLabel>
      <Flex
        w="$full"
        direction={
          props.type === "bool" ? "row" : { "@initial": "column", "@md": "row" }
        }
        gap="$2"
      >
        {props.type === "string" ? (
          <Input
            id={props.name}
            value={props.value}
            onInput={(e) => props.onChange(e.currentTarget.value)}
          />
        ) : props.type === "bool" ? (
          <HopeSwitch
            id={props.name}
            checked={props.value}
            onChange={(e: any) => props.onChange(e.currentTarget.checked)}
          />
        ) : (
          <Textarea
            id={props.name}
            value={props.value}
            onChange={(e) => props.onChange(e.currentTarget.value)}
          />
        )}
        <FormControl w="fit-content" display="flex">
          <Checkbox
            css={{ whiteSpace: "nowrap" }}
            id={`${props.name}_sub`}
            onChange={(e: any) => props.onSub(e.currentTarget.checked)}
            color="$neutral10"
            fontSize="$sm"
            checked={props.sub}
          >
            {t("metas.apply_sub")}
          </Checkbox>
        </FormControl>
      </Flex>
      <Show when={props.help}>
        <FormHelperText>{t(`metas.${props.name}_help`)}</FormHelperText>
      </Show>
    </FormControl>
  )
}

const AddOrEdit = () => {
  const t = useT()
  const { params, back } = useRouter()
  const { id } = params
  const [meta, setMeta] = createStore<Meta>({
    id: 0,
    path: "",
    password: "",
    p_sub: false,
    write: false,
    w_sub: false,
    hide: "",
    h_sub: false,
    readme: "",
    r_sub: false,
    header: "",
    header_sub: false,
  })
  const [metaLoading, loadMeta] = useFetch(
    (): PResp<Meta> => r.get(`/admin/meta/get?id=${id}`),
  )

  const initEdit = async () => {
    const resp = await loadMeta()
    handleResp(resp, setMeta)
  }
  if (id) {
    initEdit()
  }
  const [okLoading, ok] = useFetch((): PEmptyResp => {
    return r.post(`/admin/meta/${id ? "update" : "create"}`, meta)
  })
  return (
    <MaybeLoading loading={metaLoading()}>
      <VStack w="$full" alignItems="start" spacing="$2">
        <Heading>{t(`global.${id ? "edit" : "add"}`)}</Heading>
        <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="path" display="flex" alignItems="center">
            {t(`metas.path`)}
          </FormLabel>
          <FolderChooseInput
            id="path"
            value={meta.path}
            onChange={(path) => setMeta("path", path)}
          />
        </FormControl>
        {/* <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="password" display="flex" alignItems="center">
            {t(`metas.password`)}
          </FormLabel>
          <Input
            id="password"
            placeholder="********"
            value={meta.password}
            onInput={(e) => setMeta("password", e.currentTarget.value)}
          />
        </FormControl> */}
        <For
          each={
            [
              { name: "password", type: "string", sub: "p_sub" },
              { name: "write", type: "bool", sub: "w_sub" },
              { name: "hide", type: "text", sub: "h_sub", help: true },
              { name: "header", type: "text", sub: "header_sub", help: true },
              { name: "readme", type: "text", sub: "r_sub", help: true },
            ] as const
          }
        >
          {(item) => {
            return (
              // @ts-ignore
              <Item
                name={item.name}
                type={item.type as "string" | "bool" | "text"}
                value={meta[item.name as keyof Meta] as string | boolean}
                onChange={(val: any): void =>
                  setMeta(item.name as keyof Meta, val)
                }
                sub={meta[item.sub] as boolean}
                onSub={(val: boolean): void => setMeta(item.sub, val)}
                help={item.help}
              />
            )
          }}
        </For>
        <Button
          loading={okLoading()}
          onClick={async () => {
            const resp = await ok()
            // TODO maybe can use handleRrespWithNotifySuccess
            handleResp(resp, () => {
              notify.success(t("global.save_success"))
              back()
            })
          }}
        >
          {t(`global.${id ? "save" : "add"}`)}
        </Button>
      </VStack>
    </MaybeLoading>
  )
}

export default AddOrEdit
