import { useFetch, useT, useManageTitle } from "~/hooks"
import { Group, SettingItem, PResp, PEmptyResp, EmptyResp } from "~/types"
import { r, notify, getTarget, handleResp } from "~/utils"
import { createStore } from "solid-js/store"
import { Button, HStack, Heading, VStack } from "@hope-ui/solid"
import { createSignal, Index, Show } from "solid-js"
import { Item } from "./SettingItem"
import { ResponsiveGrid } from "../common/ResponsiveGrid"
import S3Buckets from "./S3Buckets"
import crypto from "crypto-js"

const bucket_parse = (settings: SettingItem[]) => {
  const string = { ...settings.find((i) => i.key === "s3_buckets")! }
  if (!string.value) return []
  return JSON.parse(string.value)
}

const S3Settings = () => {
  const t = useT()
  useManageTitle(`manage.sidemenu.s3`)
  const [settingsLoading, getSettings] = useFetch(
    (): PResp<SettingItem[]> => r.get(`/admin/setting/list?group=${Group.S3}`),
  )
  const [settings, setSettings] = createStore<SettingItem[]>([])
  const refresh = async () => {
    const resp = await getSettings()
    handleResp(resp, setSettings)
  }
  refresh()
  const [saveLoading, saveSettings] = useFetch(
    (): PEmptyResp => r.post("/admin/setting/save", getTarget(settings)),
  )
  const [loading, setLoading] = createSignal(false)
  return (
    <VStack w="$full" alignItems="start" spacing="$2">
      <ResponsiveGrid>
        <Index each={settings}>
          {(item, _) => (
            <Show when={item().key != "s3_buckets"}>
              <Item
                {...item()}
                onChange={(val) => {
                  setSettings((i) => item().key === i.key, "value", val)
                }}
                onDelete={async () => {
                  setLoading(true)
                  const resp: EmptyResp = await r.post(
                    `/admin/setting/delete?key=${item().key}`,
                  )
                  setLoading(false)
                  handleResp(resp, () => {
                    notify.success(t("global.delete_success"))
                    refresh()
                  })
                }}
              />
            </Show>
          )}
        </Index>
        <Button
          onClick={() => {
            const awsAccessKeyId = crypto.lib.WordArray.random(120 / 8)
            const awsSecretAccessKey = crypto.lib.WordArray.random(240 / 8)
            const accessKeyId = crypto.enc.Base64.stringify(
              awsAccessKeyId,
            ).replace(/[\r\n]/g, "")
            const secretAccessKey = crypto.enc.Base64.stringify(
              awsSecretAccessKey,
            ).replace(/[\r\n]/g, "")
            setSettings(
              (i) => i.key === "s3_access_key_id",
              "value",
              accessKeyId,
            )
            setSettings(
              (i) => i.key === "s3_secret_access_key",
              "value",
              secretAccessKey,
            )
          }}
        >
          {t("settings.s3_generate")}
        </Button>
        <Heading>{t("settings.s3_restart_to_apply")}</Heading>
        <S3Buckets buckets={bucket_parse(settings)} setSettings={setSettings} />
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
            //check that bucket path and name cannot be duplicated or empty
            const buckets = bucket_parse(settings)
            const names = new Set<string>()
            for (const bucket of buckets) {
              if (bucket.name === "" || bucket.path === "") {
                notify.error(t("settings.s3_buckets_empty"))
                return
              }
              if (names.has(bucket.name)) {
                notify.error(t("settings.s3_buckets_duplicate_name"))
                return
              }
              names.add(bucket.name)
            }
            const resp = await saveSettings()
            handleResp(resp, () => notify.success(t("global.save_success")))
          }}
        >
          {t("global.save")}
        </Button>
      </HStack>
    </VStack>
  )
}

export default S3Settings
