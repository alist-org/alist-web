import { Button, Heading, HStack, Input, SimpleGrid } from "@hope-ui/solid";
import { createSignal } from "solid-js";
import { MaybeLoading } from "~/components";
import { useFetch, useT, useTitle } from "~/hooks";
import { Resp, Group, SettingItem } from "~/types";
import { notify, r } from "~/utils";
import { Item } from "./SettingItem";
import copy from "copy-to-clipboard";

const OtherSettings = () => {
  const t = useT();
  useTitle(() => `${t("manage.sidemenu.other")} - ${t("manage.title")}`);
  const [uri, setUri] = createSignal("");
  const [secret, setSecret] = createSignal("");
  const [token, setToken] = createSignal("");
  const [settings, setSettings] = createSignal<SettingItem[]>([]);
  const [settings_loading, settings_data] = useFetch(() =>
    r.get(`/admin/setting/list?groups=${Group.ARIA2},${Group.SINGLE}`)
  );
  const [setAria2Loading, setAria2] = useFetch(() =>
    r.post("/admin/setting/set_aria2", { uri: uri(), secret: secret() })
  );
  const refresh = async () => {
    const resp: Resp<SettingItem[]> = await settings_data();
    if (resp.code === 200) {
      setUri(resp.data.find((i) => i.key === "aria2_uri")?.value || "");
      setSecret(resp.data.find((i) => i.key === "aria2_secret")?.value || "");
      setToken(resp.data.find((i) => i.key === "token")?.value || "");
      setSettings(resp.data);
    } else {
      notify.error(resp.message);
    }
  };
  refresh();
  const [resetTokenLoading, resetToken] = useFetch(() =>
    r.post("/admin/setting/reset_token")
  );
  return (
    <MaybeLoading loading={settings_loading()}>
      <Heading mb="$2">{t("settings.aria2")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <Item
          {...settings().find((i) => i.key === "aria2_uri")!}
          value={uri()}
          onChange={(str) => setUri(str)}
        />
        <Item
          {...settings().find((i) => i.key === "aria2_secret")!}
          value={secret()}
          onChange={(str) => setSecret(str)}
        />
      </SimpleGrid>
      <Button
        my="$2"
        loading={setAria2Loading()}
        onClick={async () => {
          const resp: Resp<string> = await setAria2();
          if (resp.code === 200) {
            notify.success(`${t("settings.aria2_version")} ${resp.data}`);
          } else {
            notify.error(resp.message);
          }
        }}
      >
        {t("settings.set_aria2")}
      </Button>
      <Heading my="$2">{t("settings.token")}</Heading>
      <Input value={token()} readOnly />
      <HStack my="$2" spacing="$2">
        <Button
          onClick={() => {
            copy(token());
            notify.success(t("global.copied"));
          }}
        >
          {t("settings.copy_token")}
        </Button>
        <Button
          colorScheme="danger"
          loading={resetTokenLoading()}
          onClick={async () => {
            const resp: Resp<string> = await resetToken();
            if (resp.code === 200) {
              notify.success(t("settings.reset_token_success"));
              setToken(resp.data);
            } else {
              notify.error(resp.message);
            }
          }}
        >
          {t("settings.reset_token")}
        </Button>
      </HStack>
    </MaybeLoading>
  );
};

export default OtherSettings;
