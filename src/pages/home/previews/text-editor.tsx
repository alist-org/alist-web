import { Button, useColorMode, VStack } from "@hope-ui/solid"
import { createMemo, createSignal, Show } from "solid-js"
import { MaybeLoading } from "~/components"
import { MonacoEditorLoader } from "~/components/MonacoEditor"
import { useFetch, useFetchText, useRouter, useT } from "~/hooks"
import { objStore, userCan } from "~/store"
import { PEmptyResp } from "~/types"
import { handleResp, notify, r } from "~/utils"

const TextEditor = () => {
  const [content] = useFetchText()
  const { colorMode } = useColorMode()
  const theme = createMemo(() => {
    return colorMode() === "light" ? "vs" : "vs-dark"
  })
  const { pathname } = useRouter()
  const [value, setValue] = createSignal(content()?.content)
  const t = useT()
  const [loading, save] = useFetch(
    (): PEmptyResp =>
      r.put("/fs/put", value(), {
        headers: {
          "File-Path": encodeURIComponent(pathname()),
          "Content-Type": content()?.contentType || "text/plain",
        },
      })
  )
  return (
    <MaybeLoading loading={content.loading}>
      <VStack w="$full" alignItems="start" spacing="$2">
        <MonacoEditorLoader
          value={content()?.content ?? ""}
          theme={theme()}
          path={objStore.obj.name}
          onChange={(value) => {
            setValue(value)
          }}
        />
        <Show when={userCan("write") || objStore.write}>
          <Button
            loading={loading()}
            onClick={async () => {
              if (!value()) {
                notify.success(t("global.save_success"))
                return
              }
              const resp = await save()
              handleResp(resp, () => {
                notify.success(t("global.save_success"))
              })
            }}
          >
            {t("global.save")}
          </Button>
        </Show>
      </VStack>
    </MaybeLoading>
  )
}

export default TextEditor
