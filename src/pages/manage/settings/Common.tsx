import { MaybeLoading } from "~/components/FullLoading";
import { useLoading } from "~/hooks/useLoading";
import { Group, SettingItem } from "~/types/setting";
import { r } from "~/utils/request";
import { createStore } from "solid-js/store";
import { Resp } from "~/types/resp";
import { notify } from "~/utils/notify";
import { Grid } from "@hope-ui/solid";
import { Index } from "solid-js";
import { Item } from "./SettingItem";

export interface CommonSettingsProps {
  group: Group;
}
const CommonSettings = (props: CommonSettingsProps) => {
  const { loading, data } = useLoading(() =>
    r.get(`/admin/setting/list?group=${props.group}`)
  );
  const [settings, setSettings] = createStore<SettingItem[]>([]);
  (async () => {
    const res: Resp<SettingItem[]> = await data();
    if (res.code === 200) {
      setSettings(res.data);
    } else {
      notify.error(res.message);
    }
  })();
  return (
    <MaybeLoading loading={loading()}>
      <Grid templateColumns="repeat(auto-fill, minmax(400px,1fr))" gap="$2">
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
      </Grid>
    </MaybeLoading>
  );
};

export default CommonSettings;
