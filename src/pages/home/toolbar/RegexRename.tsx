import { createDisclosure } from "@hope-ui/solid"
import { ModalTwoInput } from "~/components"
import { useFetch, usePath, useRouter } from "~/hooks"
import { bus, fsRegexRename, handleRespWithNotifySuccess } from "~/utils"
import { onCleanup } from "solid-js"

export const RegexRename = () => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsRegexRename)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const handler = (name: string) => {
    if (name === "regexRename") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <ModalTwoInput
      title="home.toolbar.regular_rename"
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      onSubmit={async (srcName, newName) => {
        const resp = await ok(pathname(), srcName, newName)
        handleRespWithNotifySuccess(resp, () => {
          refresh()
          onClose()
        })
      }}
    />
  )
}
