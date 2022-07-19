import { Button, Heading, SimpleGrid } from "@hope-ui/solid";
import { createSignal, For, Show } from "solid-js";
import { MaybeLoading } from "~/components";
import { useFetch, useRouter, useT } from "~/hooks";
import { notify, r } from "~/utils";
import { Addition, DriverItem, Resp, Storage, Type } from "~/types";
import { createStore } from "solid-js/store";
import { Item } from "./Item";

interface DriverItems {
  main: DriverItem[];
  additional: DriverItem[];
}

function GetDefaultValue(type: Type, value?: string) {
  switch (type) {
    case Type.Bool:
      if (value) {
        return value === "true";
      }
      return false;
    case Type.Number:
      if (value) {
        return parseInt(value);
      }
      return 0;
    default:
      if (value) {
        return value;
      }
      return "";
  }
}

type Drivers = Record<string, DriverItems>;

const AddOrEdit = () => {
  const t = useT();
  const { params } = useRouter();
  const { id } = params;
  const [loadingDrivers, loadDrivers] = useFetch(
    () => r.get("/admin/driver/list"),
    true
  );
  const [drivers, setDrivers] = createSignal<Drivers>({});
  const initAdd = async () => {
    const resp: Resp<Drivers> = await loadDrivers();
    if (resp.code === 200) {
      setDrivers(resp.data);
    } else {
      notify.error(resp.message);
    }
  };

  const [loadingStorage, loadStorage] = useFetch(
    () => r.get(`/admin/storage/get?id=${id}`),
    true
  );
  const [loadingDriver, loadDriver] = useFetch(
    () => r.get(`/admin/driver/items?driver=${storage.driver}`),
    true
  );
  const initEdit = async () => {
    const storageResp: Resp<Storage> = await loadStorage();
    if (storageResp.code === 200) {
      setStorage(storageResp.data);
      setAddition(JSON.parse(storageResp.data.addition));
      const driverResp: Resp<DriverItems> = await loadDriver();
      if (driverResp.code === 200) {
        setDrivers({ [storage.driver]: driverResp.data });
      } else {
        notify.error(driverResp.message);
      }
    } else {
      notify.error(storageResp.message);
    }
  };
  if (id) {
    initEdit();
  } else {
    initAdd();
  }
  const [storage, setStorage] = createStore<Storage>({} as Storage);
  const [addition, setAddition] = createStore<Addition>({});
  const [okLoading, ok] = useFetch(() => {
    setStorage("addition", JSON.stringify(addition));
    return r.post(`/admin/storage/${id ? "update" : "create"}`, storage);
  });
  return (
    <MaybeLoading
      loading={id ? loadingStorage() || loadingDriver() : loadingDrivers()}
    >
      <Heading mb="$2">{t(`global.${id ? "edit" : "add"}`)}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2, "@2xl": 3 }}>
        <Item
          name="driver"
          default=""
          readonly={id !== undefined}
          required
          type={Type.Select}
          values={id ? storage.driver : Object.keys(drivers()).join(",")}
          value={storage.driver}
          onChange={(value) => {
            setStorage("driver", value);
            for (const item of drivers()[value].main) {
              setStorage(
                item.name as keyof Storage,
                GetDefaultValue(item.type, item.default) as any
              );
            }
            for (const item of drivers()[value].additional) {
              setAddition(
                item.name,
                GetDefaultValue(item.type, item.default) as any
              );
            }
          }}
        />
        <Show when={drivers()[storage.driver]}>
          <For each={drivers()[storage.driver].main}>
            {(item) => (
              <Item
                {...item}
                value={(storage as any)[item.name]}
                onChange={(val: any) => {
                  setStorage(item.name as keyof Storage, val);
                }}
              />
            )}
          </For>
          <For each={drivers()[storage.driver].additional}>
            {(item) => (
              <Item
                {...item}
                value={addition[item.name] as any}
                onChange={(val: any) => {
                  setAddition(item.name, val);
                }}
              />
            )}
          </For>
        </Show>
      </SimpleGrid>
      <Button
        mt="$2"
        loading={okLoading()}
        onClick={async () => {
          const resp: Resp<{}> = await ok();
          if (resp.code === 200) {
            notify.success(t("global.success"));
          } else {
            notify.error(resp.message);
          }
        }}
      >
        {t(`global.${id ? "save" : "add"}`)}
      </Button>
    </MaybeLoading>
  );
};

export default AddOrEdit;
