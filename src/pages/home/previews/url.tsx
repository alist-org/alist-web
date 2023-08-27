import { MaybeLoading } from "~/components"
import { FileInfo } from "./info"
import { useFetchText, useParseText, useT } from "~/hooks"
import { createEffect } from "solid-js"
import { Button } from "@hope-ui/solid"

export default function () {
  const [content] = useFetchText()
  function openInNewWindow() {
    const url = content()?.content
    const { text } = useParseText(url)
    url && window.open(text(), "_blank")
  }
  createEffect(() => {
    openInNewWindow()
  })
  const t = useT()
  return (
    <MaybeLoading loading={content.loading}>
      <FileInfo>
        <Button onClick={openInNewWindow}>
          {t("home.preview.open_in_new_window")}
        </Button>
      </FileInfo>
    </MaybeLoading>
  )
}
