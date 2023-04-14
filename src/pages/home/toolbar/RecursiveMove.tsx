import { createDisclosure } from "@hope-ui/solid"
import { ModalFolderChoose } from "~/components"
import { useFetch, usePath, useRouter } from "~/hooks"
import { bus, fsRecursiveMove, handleRespWithNotifySuccess } from "~/utils"
import { onCleanup } from "solid-js"

export const RecursiveMove = () => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsRecursiveMove)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const handler = (name: string) => {
    if (name === "recursiveMove") {
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
        const resp = await ok(pathname(), dst)
        handleRespWithNotifySuccess(resp, () => {
          refresh()
          onClose()
        })
      }}
    />
  )
}
