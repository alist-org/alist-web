import { createDisclosure } from "@hope-ui/solid"
import { ModalInput } from "~/components"
import { useFetch, useRouter, useT } from "~/hooks"
import { addAria2, bus, handleRespWithNotifySuccess } from "~/utils"
import { onCleanup } from "solid-js"

export const Aria2 = () => {
  const t = useT()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(addAria2)
  const { pathname } = useRouter()
  const handler = (name: string) => {
    if (name === "offline_download") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <ModalInput
      title="home.toolbar.offline_download"
      type="text"
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      tips={t("home.toolbar.offline_download-tips")}
      onSubmit={async (urls) => {
        const resp = await ok(pathname(), urls.split("\n"))
        handleRespWithNotifySuccess(resp, () => {
          onClose()
        })
      }}
    />
  )
}
