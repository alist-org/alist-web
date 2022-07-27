import { Button, Heading } from "@hope-ui/solid";
import { createSignal, For, Show } from "solid-js";
import { MaybeLoading } from "~/components";
import { useFetch, useRouter, useT } from "~/hooks";
import { handleRresp, notify, r } from "~/utils";
import { Addition, DriverItem, Resp, Storage, Type } from "~/types";
import { createStore } from "solid-js/store";
import { Item } from "./Item";
import { ResponsiveGrid } from "../ResponsiveGrid";

interface DriverItems {
  common: DriverItem[];
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
  const { params, back } = useRouter();
  const { id } = params;
  const [driversLoading, loadDrivers] = useFetch(
    () => r.get("/admin/driver/list"),
    true
  );
  const [drivers, setDrivers] = createSignal<Drivers>({});
  const initAdd = async () => {
    const resp: Resp<Drivers> = await loadDrivers();
    handleRresp(resp, setDrivers);
  };

  const [storageLoading, loadStorage] = useFetch(
    () => r.get(`/admin/storage/get?id=${id}`),
    true
  );
  const [driverLoading, loadDriver] = useFetch(
    () => r.get(`/admin/driver/items?driver=${storage.driver}`),
    true
  );
  const initEdit = async () => {
    const storageResp: Resp<Storage> = await loadStorage();
    handleRresp(storageResp, async (storageData) => {
      setStorage(storageData);
      setAddition(JSON.parse(storageData.addition));
      const driverResp: Resp<DriverItems> = await loadDriver();
      handleRresp(driverResp, (driverData) =>
        setDrivers({ [storage.driver]: driverData })
      );
    });
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
      loading={id ? storageLoading() || driverLoading() : driversLoading()}
    >
      <Heading mb="$2">{t(`global.${id ? "edit" : "add"}`)}</Heading>
      <ResponsiveGrid>
        <Item
          name="driver"
          default=""
          readonly={id !== undefined}
          required
          type={Type.Select}
          values={id ? storage.driver : Object.keys(drivers()).join(",")}
          value={storage.driver}
          scop="common"
          onChange={(value) => {
            setStorage("driver", value);
            for (const item of drivers()[value].common) {
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
          <For each={drivers()[storage.driver].common}>
            {(item) => (
              <Item
                {...item}
                scop="common"
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
                scop={storage.driver}
                value={addition[item.name] as any}
                onChange={(val: any) => {
                  setAddition(item.name, val);
                }}
              />
            )}
          </For>
        </Show>
      </ResponsiveGrid>
      <Button
        mt="$2"
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
    </MaybeLoading>
  );
};

export default AddOrEdit;
