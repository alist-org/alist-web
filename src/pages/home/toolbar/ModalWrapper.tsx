import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  createDisclosure,
  ModalCloseButton,
} from "@hope-ui/solid"
import { JSXElement, onCleanup, Show, Suspense } from "solid-js"
import { FullLoading } from "~/components"
import { useT } from "~/hooks"
import { bus } from "~/utils"

export const ModalWrapper = (props: {
  children: JSXElement
  name: string
  title: string
  blockScrollOnMount?: boolean
}) => {
  const t = useT()
  const handler = (name: string) => {
    if (name === props.name) {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  const { isOpen, onOpen, onClose } = createDisclosure()
  return (
    <Modal
      blockScrollOnMount={props.blockScrollOnMount}
      opened={isOpen()}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size={{
        "@initial": "xs",
        "@md": "md",
        "@lg": "lg",
        "@xl": "xl",
        "@2xl": "2xl",
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>{t(props.title)}</ModalHeader>
        <ModalBody>
          <Show when={isOpen()}>
            <Suspense fallback={<FullLoading />}>{props.children}</Suspense>
          </Show>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
