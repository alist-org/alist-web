import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  createDisclosure,
} from "@hope-ui/solid"
import { ModalFolderChoose } from "~/components"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { bus, fsRecursiveMove, handleRespWithNotifySuccess } from "~/utils"
import { onCleanup } from "solid-js"

export const RecursiveMove = () => {
  const {
    isOpen: isConfirmModalOpen,
    onOpen: openConfirmModal,
    onClose: closeConfirmModal,
  } = createDisclosure()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsRecursiveMove)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const handler = (name: string) => {
    if (name === "recursiveMove") {
      openConfirmModal()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  const t = useT()
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        opened={isConfirmModalOpen()}
        onClose={() => closeConfirmModal()}
        size={{
          "@initial": "xs",
          "@md": "md",
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("home.toolbar.recursive_move")}</ModalHeader>
          <ModalBody>
            <p>{t("home.toolbar.recursive_move_directory-tips")}</p>
          </ModalBody>
          <ModalFooter display="flex" gap="$2">
            <Button onClick={() => closeConfirmModal()} colorScheme="neutral">
              {t("global.cancel")}
            </Button>
            <Button
              onClick={() => {
                closeConfirmModal()
                onOpen()
              }}
              colorScheme="danger"
            >
              {t("global.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </>
  )
}
