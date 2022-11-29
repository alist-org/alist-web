import { Button } from "@hope-ui/solid"
import { createSignal } from "solid-js"
import { useT } from "~/hooks"
import { objStore } from "~/store"
import { FileInfo } from "./info"

const Plist = () => {
  const t = useT()
  const [installing, setInstalling] = createSignal(false)
  return (
    <FileInfo>
      <Button
        as="a"
        href={
          "itms-services://?action=download-manifest&url=" + objStore.raw_url
        }
        onClick={() => {
          setInstalling(true)
        }}
      >
        {t(`home.preview.${installing() ? "installing" : "install"}`)}
      </Button>
    </FileInfo>
  )
}

export default Plist
