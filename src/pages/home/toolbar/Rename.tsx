import { createDisclosure } from "@hope-ui/solid"
import { onCleanup, Show } from "solid-js"
import { ModalInput } from "~/components"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { oneChecked, selectedObjs } from "~/store"
import {
  bus,
  fsRename,
  handleRespWithNotifySuccess,
  notify,
  pathJoin,
} from "~/utils"

export const Rename = () => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const t = useT()
  const [loading, ok] = useFetch(fsRename)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const handler = (name: string) => {
    if (name === "rename") {
      if (!oneChecked()) {
        notify.warning(t("home.toolbar.only_one-tips"))
        return
      }
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <Show when={isOpen()}>
      <ModalInput
        title="home.toolbar.input_new_name"
        opened={isOpen()}
        onClose={onClose}
        defaultValue={selectedObjs()[0]?.name ?? ""}
        loading={loading()}
        onSubmit={async (name) => {
          const resp = await ok(
            pathJoin(pathname(), selectedObjs()[0].name),
            name
          )
          handleRespWithNotifySuccess(resp, () => {
            refresh()
            onClose()
          })
        }}
      />
    </Show>
  )
}
