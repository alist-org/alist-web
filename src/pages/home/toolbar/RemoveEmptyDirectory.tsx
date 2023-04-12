import { createDisclosure } from "@hope-ui/solid"
import { ModalFolderChoose } from "~/components"
import { useFetch, usePath } from "~/hooks"
import {
  bus,
  fsRemoveEmptyDirectory,
  handleRespWithNotifySuccess,
} from "~/utils"
import { onCleanup } from "solid-js"

export const RemoveEmptyDirectory = () => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsRemoveEmptyDirectory)
  const { refresh } = usePath()
  const handler = (name: string) => {
    if (name === "removeEmptyDirectory") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <ModalFolderChoose
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      onSubmit={async (dst) => {
        const resp = await ok(dst)
        handleRespWithNotifySuccess(resp, () => {
          refresh()
          onClose()
        })
      }}
    />
  )
}
