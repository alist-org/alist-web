import { Button, Heading, HStack, Input, SimpleGrid } from "@hope-ui/solid"
import { createSignal } from "solid-js"
import { MaybeLoading } from "~/components"
import { useFetch, useManageTitle, useT, useUtil } from "~/hooks"
import { Group, SettingItem, PResp } from "~/types"
import { handleResp, notify, r } from "~/utils"
import { Item } from "./SettingItem"

const OtherSettings = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.other")
  const [uri, setUri] = createSignal("")
  const [secret, setSecret] = createSignal("")
  const [qbitUrl, setQbitUrl] = createSignal("")
  const [qbitSeedTime, setQbitSeedTime] = createSignal("")
  const [token, setToken] = createSignal("")
  const [settings, setSettings] = createSignal<SettingItem[]>([])
  const [settingsLoading, settingsData] = useFetch(
    (): PResp<SettingItem[]> =>
      r.get(`/admin/setting/list?groups=${Group.ARIA2},${Group.SINGLE}`),
  )
  const [setAria2Loading, setAria2] = useFetch(
    (): PResp<string> =>
      r.post("/admin/setting/set_aria2", { uri: uri(), secret: secret() }),
  )
  const [setQbitLoading, setQbit] = useFetch(
    (): PResp<string> =>
      r.post("/admin/setting/set_qbit", {
        url: qbitUrl(),
        seedtime: qbitSeedTime(),
      }),
  )
  const refresh = async () => {
    const resp = await settingsData()
    handleResp(resp, (data) => {
      setUri(data.find((i) => i.key === "aria2_uri")?.value || "")
      setSecret(data.find((i) => i.key === "aria2_secret")?.value || "")
      setToken(data.find((i) => i.key === "token")?.value || "")
      setQbitUrl(data.find((i) => i.key === "qbittorrent_url")?.value || "")
      setQbitSeedTime(
        data.find((i) => i.key === "qbittorrent_seedtime")?.value || "",
      )
      setSettings(data)
    })
  }
  refresh()
  const [resetTokenLoading, resetToken] = useFetch(
    (): PResp<string> => r.post("/admin/setting/reset_token"),
  )
  const { copy } = useUtil()

  return (
    <MaybeLoading loading={settingsLoading()}>
      <Heading mb="$2">{t("settings_other.aria2")}</Heading>
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
          const resp = await setAria2()
          handleResp(resp, (data) => {
            notify.success(`${t("settings_other.aria2_version")} ${data}`)
          })
        }}
      >
        {t("settings_other.set_aria2")}
      </Button>
      <Heading my="$2">{t("settings_other.qbittorrent")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <Item
          {...settings().find((i) => i.key === "qbittorrent_url")!}
          value={qbitUrl()}
          onChange={(str) => setQbitUrl(str)}
        />
        <Item
          {...settings().find((i) => i.key === "qbittorrent_seedtime")!}
          value={qbitSeedTime()}
          onChange={(str) => setQbitSeedTime(str)}
        />
      </SimpleGrid>
      <Button
        my="$2"
        loading={setQbitLoading()}
        onClick={async () => {
          const resp = await setQbit()
          handleResp(resp, (data) => {
            notify.success(data)
          })
        }}
      >
        {t("settings_other.set_qbit")}
      </Button>
      <Heading my="$2">{t("settings.token")}</Heading>
      <Input value={token()} readOnly />
      <HStack my="$2" spacing="$2">
        <Button
          onClick={() => {
            copy(token())
          }}
        >
          {t("settings_other.copy_token")}
        </Button>
        <Button
          colorScheme="danger"
          loading={resetTokenLoading()}
          onClick={async () => {
            const resp = await resetToken()
            handleResp(resp, (data) => {
              notify.success(t("settings_other.reset_token_success"))
              setToken(data)
            })
          }}
        >
          {t("settings_other.reset_token")}
        </Button>
      </HStack>
    </MaybeLoading>
  )
}

export default OtherSettings
