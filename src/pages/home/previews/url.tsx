import { MaybeLoading } from "~/components"
import { FileInfo } from "./info"
import { useFetchText, useT } from "~/hooks"
import { createEffect } from "solid-js"
import { Button } from "@hope-ui/solid"

export default function () {
  const [content] = useFetchText()
  createEffect(() => {
    const url = content()?.content
    url && window.open(url, "_blank")
  })
  const t = useT()
  return (
    <MaybeLoading loading={content.loading}>
      <FileInfo>
        <Button>{t("home.preview.open_in_new_window")}</Button>
      </FileInfo>
    </MaybeLoading>
  )
}
