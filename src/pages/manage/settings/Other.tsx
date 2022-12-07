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
  const [token, setToken] = createSignal("")
  const [github_client_id, setgithubClientId] = createSignal("")
  const [github_client_secret, setgithubClientSecret] = createSignal("")
  const [github_login_enabled, setgithubloginenabled] = createSignal("")
  const [settings, setSettings] = createSignal<SettingItem[]>([])
  const [settingsLoading, settingsData] = useFetch(
    (): PResp<SettingItem[]> =>
      r.get(
        `/admin/setting/list?groups=${Group.ARIA2},${Group.SINGLE},${Group.GITHUB}`
      )
  )
  const [setAria2Loading, setAria2] = useFetch(
    (): PResp<string> =>
      r.post("/admin/setting/set_aria2", { uri: uri(), secret: secret() })
  )

  const [setGithubloginLoading, setGithublogin] = useFetch(
    (a, b, c): PResp<string> => r.post("/admin/setting/save", [a, b, c])
  )
  const refresh = async () => {
    const resp = await settingsData()
    handleResp(resp, (data) => {
      setUri(data.find((i) => i.key === "aria2_uri")?.value || "")
      setSecret(data.find((i) => i.key === "aria2_secret")?.value || "")
      setToken(data.find((i) => i.key === "token")?.value || "")
      setgithubClientId(
        data.find((i) => i.key === "github_client_id")?.value || ""
      )
      setgithubClientSecret(
        data.find((i) => i.key === "github_client_secret")?.value || ""
      )
      setgithubloginenabled(
        data.find((i) => i.key === "github_login_enabled")?.value || ""
      )
      setSettings(data)
    })
  }
  refresh()
  const [resetTokenLoading, resetToken] = useFetch(
    (): PResp<string> => r.post("/admin/setting/reset_token")
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
      <Heading mb="$2">Github Login</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <Item
          {...settings().find((i) => i.key === "github_client_id")!}
          value={github_client_id()}
          onChange={(str) => setgithubClientId(str)}
        />
        <Item
          {...settings().find((i) => i.key === "github_client_secrets")!}
          value={github_client_secret()}
          onChange={(str) => setgithubClientSecret(str)}
        />
        <Item
          {...settings().find((i) => i.key === "github_login_enabled")!}
          value={github_login_enabled()}
          onChange={(str) => setgithubloginenabled(str)}
        />
      </SimpleGrid>
      <Button
        my="$2"
        loading={setGithubloginLoading()}
        onClick={async () => {
          const clientid = settings().find((s) => s.key === "github_client_id")
          clientid.value = github_client_id()
          const clientsecrets = settings().find(
            (s) => s.key === "github_client_secrets"
          )
          clientsecrets.value = github_client_secret()
          const loginenabled = settings().find(
            (s) => s.key === "github_login_enabled"
          )
          loginenabled.value = github_login_enabled()
          const resp = await setGithublogin(
            clientid,
            clientsecrets,
            loginenabled
          )
          handleResp(resp, () => {
            notify.success("Github login settings updated")
          })
        }}
      >
        Set Github Login
      </Button>
    </MaybeLoading>
  )
}

export default OtherSettings
