import {
  Button,
  Checkbox,
  Switch as HopeSwitch,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack,
  Flex,
} from "@hope-ui/solid";
import { MaybeLoading, FolderChooseInput } from "~/components";
import { useFetch, useRouter, useT } from "~/hooks";
import { handleRresp, notify, r } from "~/utils";
import { Resp, Meta } from "~/types";
import { createStore } from "solid-js/store";
import { For } from "solid-js";

type ItemProps = { name: string; onSub: (val: boolean) => void } & (
  | { value: string; onChange: (val: string) => void }
  | { value: boolean; onChange: (val: boolean) => void }
  | { value: number; onChange: (val: number) => void }
);
const Item = (props: ItemProps) => {
  const t = useT();
  return (
    <FormControl w="$full" display="flex" flexDirection="column" required>
      <FormLabel for={props.name} display="flex" alignItems="center">
        {t(`metas.${props.name}`)}
      </FormLabel>
      <Flex
        w="$full"
        direction={
          typeof props.value === "boolean"
            ? "row"
            : { "@initial": "column", "@md": "row" }
        }
        gap="$2"
      >
        {typeof props.value === "string" ? (
          <Input
            id={props.name}
            value={props.value}
            // @ts-ignore
            onInput={(e) => props.onChange(e.currentTarget.value)}
          />
        ) : typeof props.value === "boolean" ? (
          <HopeSwitch
            id={props.name}
            defaultChecked={props.value}
            // @ts-ignore
            onChange={(e: any) => props.onChange(e.currentTarget.checked)}
          />
        ) : (
          <></>
        )}
        <FormControl w="fit-content" display="flex">
          <Checkbox
            css={{ whiteSpace: "nowrap" }}
            id={`${props.name}_sub`}
            onChange={(e: any) => props.onSub(e.currentTarget.checked)}
            color="$neutral10"
            fontSize="$sm"
          >
            {t("metas.apply_sub")}
          </Checkbox>
        </FormControl>
      </Flex>
    </FormControl>
  );
};

const AddOrEdit = () => {
  const t = useT();
  const { params, back } = useRouter();
  const { id } = params;
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
  });
  const [metaLoading, loadMeta] = useFetch(() =>
    r.get(`/admin/meta/get?id=${id}`)
  );

  const initEdit = async () => {
    const resp: Resp<Meta> = await loadMeta();
    handleRresp(resp, setMeta);
  };
  if (id) {
    initEdit();
  }
  const [okLoading, ok] = useFetch(() => {
    return r.post(`/admin/meta/${id ? "update" : "create"}`, meta);
  });
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
        <For each={["password", "write", "hide", "readme"] as (keyof Meta)[]}>
          {(item) => (
            <Item
              name={item}
              value={meta[item]}
              onChange={(val: any): void => setMeta(item, val)}
              onSub={(val: boolean): void =>
                setMeta(`${item[0]}_sub` as keyof Meta, val)
              }
            />
          )}
        </For>
        <Button
          loading={okLoading()}
          onClick={async () => {
            const resp: Resp<{}> = await ok();
            // TODO mybe can use handleRrespWithNotifySuccess
            handleRresp(resp, () => {
              notify.success(t("global.success"));
              back();
            });
          }}
        >
          {t(`global.${id ? "save" : "add"}`)}
        </Button>
      </VStack>
    </MaybeLoading>
  );
};

export default AddOrEdit;
