import { MaybeLoading } from "~/components/FullLoading";
import { useLoading } from "~/hooks/useLoading";
import { Group, SettingItem } from "~/types/setting";
import { r } from "~/utils/request";
import { createStore } from "solid-js/store";
import { Resp } from "~/types/resp";
import { notify } from "~/utils/notify";
import { Button, SimpleGrid } from "@hope-ui/solid";
import { createSignal, Index } from "solid-js";
import { Item } from "./SettingItem";
import { useT } from "~/hooks/useT";
import { getTarget } from "~/utils/proxy";

export interface CommonSettingsProps {
  group: Group;
}
const CommonSettings = (props: CommonSettingsProps) => {
  const t = useT();
  const [settings_loading, settings_data] = useLoading(() =>
    r.get(`/admin/setting/list?group=${props.group}`)
  );
  const [settings, setSettings] = createStore<SettingItem[]>([]);
  const initSettings = async () => {
    const res: Resp<SettingItem[]> = await settings_data();
    if (res.code === 200) {
      setSettings(res.data);
    } else {
      notify.error(res.message);
    }
  };
  initSettings();
  const [save_loading, save_data] = useLoading(() =>
    r.post("/admin/setting/save", getTarget(settings))
  );
  const [loading, setLoading] = createSignal(false);
  return (
    <MaybeLoading loading={settings_loading() || loading()}>
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
                  initSettings();
                } else {
                  notify.error(res.message);
                }
              }}
            />
          )}
        </Index>
      </SimpleGrid>
      <Button
        mt="$2"
        loading={save_loading()}
        onClick={async () => {
          console.log(settings);
          const res: Resp<{}> = await save_data();
          if (res.code === 200) {
            notify.success(t("manage.settings.success"));
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
