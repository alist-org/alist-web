import { useFetch, useT, useRouter, useManageTitle } from "~/hooks";
import { Group, SettingItem, Resp } from "~/types";
import { r, notify, getTarget, handleRresp } from "~/utils";
import { createStore } from "solid-js/store";
import { Button, HStack, VStack } from "@hope-ui/solid";
import { createSignal, Index } from "solid-js";
import { Item } from "./SettingItem";
import { ResponsiveGrid } from "../common/ResponsiveGrid";

export interface CommonSettingsProps {
  group: Group;
}
const CommonSettings = (props: CommonSettingsProps) => {
  const t = useT();
  const { pathname } = useRouter();
  useManageTitle(`manage.sidemenu.${pathname().split("/").pop()}`);
  const [settingsLoading, getSettings] = useFetch(() =>
    r.get(`/admin/setting/list?group=${props.group}`)
  );
  const [settings, setSettings] = createStore<SettingItem[]>([]);
  const refresh = async () => {
    const resp: Resp<SettingItem[]> = await getSettings();
    handleRresp(resp, setSettings);
  };
  refresh();
  const [saveLoading, saveSettings] = useFetch(() =>
    r.post("/admin/setting/save", getTarget(settings))
  );
  const [loading, setLoading] = createSignal(false);
  return (
    <VStack w="$full" alignItems="start" spacing="$2">
      <ResponsiveGrid>
        <Index each={settings}>
          {(item, _) => (
            <Item
              {...item()}
              onChange={(val) => {
                setSettings((i) => item().key === i.key, "value", val);
              }}
              onDelete={async () => {
                setLoading(true);
                const resp: Resp<{}> = await r.post(
                  `/admin/setting/delete?key=${item().key}`
                );
                setLoading(false);
                handleRresp(resp, () => {
                  notify.success(t("global.delete_success"));
                  refresh();
                });
              }}
            />
          )}
        </Index>
      </ResponsiveGrid>
      <HStack spacing="$2">
        <Button
          colorScheme="accent"
          onClick={refresh}
          loading={settingsLoading() || loading()}
        >
          {t("global.refresh")}
        </Button>
        <Button
          loading={saveLoading()}
          onClick={async () => {
            const resp: Resp<{}> = await saveSettings();
            handleRresp(resp, () => notify.success(t("global.save_success")));
          }}
        >
          {t("global.save")}
        </Button>
      </HStack>
    </VStack>
  );
};

export default CommonSettings;
