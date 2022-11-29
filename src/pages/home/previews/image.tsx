import { Error, FullLoading, ImageWithError } from "~/components"
import { useT } from "~/hooks"
import { objStore } from "~/store"

const Preview = () => {
  const t = useT()
  return (
    <ImageWithError
      maxH="75vh"
      rounded="$lg"
      src={objStore.raw_url}
      fallback={<FullLoading />}
      fallbackErr={<Error msg={t("home.preview.failed_load_img")} />}
    />
  )
}

export default Preview
