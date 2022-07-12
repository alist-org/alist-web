import { MaybeLoading } from "~/components";
import { useLoading, useT } from "~/hooks";
import { Group, SettingItem, Resp } from "~/types";
import { r, notify, getTarget } from "~/utils";
import { createStore } from "solid-js/store";
import { Button, SimpleGrid } from "@hope-ui/solid";
import { createSignal, Index } from "solid-js";
import { Item } from "./SettingItem";

export interface CommonSettingsProps {
  group: Group;
}
const CommonSettings = (props: CommonSettingsProps) => {
  const t = useT();
  const [settingsLoading, getSettings] = useLoading(() =>
    r.get(`/admin/setting/list?group=${props.group}`)
  );
  const [settings, setSettings] = createStore<SettingItem[]>([]);
  const refresh = async () => {
    const res: Resp<SettingItem[]> = await getSettings();
    if (res.code === 200) {
      setSettings(res.data);
    } else {
      notify.error(res.message);
    }
  };
  refresh();
  const [saveLoading, saveSettings] = useLoading(() =>
    r.post("/admin/setting/save", getTarget(settings))
  );
  const [loading, setLoading] = createSignal(false);
  return (
    <MaybeLoading loading={settingsLoading() || loading()}>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2, "@2xl": 3 }}>
        <Index each={settings}>
          {(item, i) => (
            <Item
              {...item()}
              onChange={(val) => {
                setSettings((i) => item().key === i.key, "value", val);
              }}
              onDelete={async () => {
                setLoading(true);
                const res: Resp<{}> = await r.post(
                  `/admin/setting/delete?key=${item().key}`
                );
                setLoading(false);
                if (res.code === 200) {
                  notify.success(t("manage.settings.delete_success"));
                  refresh();
                } else {
                  notify.error(res.message);
                }
              }}
            />
          )}
        </Index>
      </SimpleGrid>
      <Button
        my="$2"
        loading={saveLoading()}
        onClick={async () => {
          console.log(settings);
          const res: Resp<{}> = await saveSettings();
          if (res.code === 200) {
            notify.success(t("manage.settings.save_success"));
          } else {
            notify.error(res.message);
          }
        }}
      >
        {t("manage.settings.save")}
      </Button>
    </MaybeLoading>
  );
};

export default CommonSettings;
