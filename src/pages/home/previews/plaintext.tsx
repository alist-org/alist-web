import { MaybeLoading, Plaintext } from "~/components"
import { useFetchText } from "~/hooks"

const TextPreview = () => {
  const [content] = useFetchText()
  return (
    <MaybeLoading loading={content.loading}>
      <Plaintext content={content()?.content ?? ""} />
    </MaybeLoading>
  )
}

export default TextPreview
