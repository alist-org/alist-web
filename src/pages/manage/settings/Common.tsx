import { MaybeLoading } from "~/components/FullLoading";
import { useLoading } from "~/hooks/useLoading";
import { Group, SettingItem } from "~/types/setting";
import { r } from "~/utils/request";
import { createStore } from "solid-js/store";
import { Resp } from "~/types/resp";
import { notify } from "~/utils/notify";
import { Button, SimpleGrid } from "@hope-ui/solid";
import { Index } from "solid-js";
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
  (async () => {
    const res: Resp<SettingItem[]> = await settings_data();
    if (res.code === 200) {
      setSettings(res.data);
    } else {
      notify.error(res.message);
    }
  })();
  const [save_loading, save_data] = useLoading(() =>
    r.post("/admin/setting/save", getTarget(settings))
  );
  return (
    <MaybeLoading loading={settings_loading()}>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2, "@2xl": 3 }}>
        <Index each={settings}>
          {(item, i) => (
            <Item
              {...item()}
              onChange={(val) => {
                setSettings((i) => item().key === i.key, "value", val);
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
