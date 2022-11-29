import { hope } from "@hope-ui/solid"
import { BoxWithFullScreen, MaybeLoading } from "~/components"
import { useFetchText } from "~/hooks"

const HtmlPreview = () => {
  const [content] = useFetchText()
  return (
    <MaybeLoading loading={content.loading}>
      <BoxWithFullScreen w="$full" h="70vh">
        <hope.iframe
          w="$full"
          h="$full"
          rounded="$lg"
          shadow="$md"
          srcdoc={content()?.content}
        />
      </BoxWithFullScreen>
    </MaybeLoading>
  )
}

export default HtmlPreview
