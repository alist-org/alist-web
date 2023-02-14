import { Box, createDisclosure } from "@hope-ui/solid"
import { ModalInput, SelectWrapper } from "~/components"
import { useFetch, useRouter, useT } from "~/hooks"
import { offlineDownload, bus, handleRespWithNotifySuccess } from "~/utils"
import { createSignal, onCleanup } from "solid-js"

export const OfflineDownload = () => {
  const t = useT()
  const [type, setType] = createSignal("aria2")
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(offlineDownload)
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
      topSlot={
        <Box mb="$2">
          <SelectWrapper
            value={type()}
            onChange={(v) => setType(v)}
            options={[
              { value: "aria2", label: "Aria2" },
              { value: "qbit", label: "qBittorrent" },
            ]}
          />
        </Box>
      }
      onSubmit={async (urls) => {
        const resp = await ok(pathname(), urls.split("\n"), type())
        handleRespWithNotifySuccess(resp, () => {
          onClose()
        })
      }}
    />
  )
}
