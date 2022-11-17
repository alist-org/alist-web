import { Markdown, MaybeLoading } from "~/components"
import { useFetchText } from "~/hooks"
import { objStore } from "~/store"
import { ext } from "~/utils"

const MdPreview = () => {
  const [content] = useFetchText()
  const convertToMd = (content: string) => {
    if (!objStore.obj.name.endsWith(".md")) {
      return "```" + ext(objStore.obj.name) + "\n" + content + "\n```"
    }
    return content
  }
  return (
    <MaybeLoading loading={content.loading}>
      <Markdown children={convertToMd(content()?.content ?? "")} />
    </MaybeLoading>
  )
}

export default MdPreview
