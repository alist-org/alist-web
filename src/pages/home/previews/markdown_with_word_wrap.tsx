import { Markdown, MaybeLoading, MarkdownToc } from "~/components"
import { useFetchText } from "~/hooks"

const MdPreview = () => {
  const [content] = useFetchText()
  return (
    <MaybeLoading loading={content.loading}>
      <Markdown class="word-wrap" children={content()?.content} />
      <MarkdownToc />
    </MaybeLoading>
  )
}

export default MdPreview
