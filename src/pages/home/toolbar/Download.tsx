import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  createDisclosure,
} from "@hope-ui/solid"
import { createSignal, lazy, onCleanup, Show, Suspense } from "solid-js"
import { FullLoading } from "~/components"
import { useT, useDownload } from "~/hooks"
import { getSettingBool, me } from "~/store"
import { UserMethods } from "~/types"
import { bus } from "~/utils"
import { CenterIcon } from "./Icon"

export const Download = () => {
  const t = useT()
  const colorScheme = "neutral"
  const { batchDownloadSelected, sendToAria2 } = useDownload()
  return (
    <Menu placement="top" offset={10}>
      <MenuTrigger as={CenterIcon} name="download" />
      <MenuContent>
        <MenuItem colorScheme={colorScheme} onSelect={batchDownloadSelected}>
          {t("home.toolbar.batch_download")}
        </MenuItem>
        <Show
          when={
            UserMethods.is_admin(me()) || getSettingBool("package_download")
          }
        >
          <MenuItem
            colorScheme={colorScheme}
            onSelect={() => {
              bus.emit("tool", "package_download")
            }}
          >
            {t("home.toolbar.package_download")}
          </MenuItem>
        </Show>
        <MenuItem colorScheme={colorScheme} onSelect={sendToAria2}>
          {t("home.toolbar.send_aria2")}
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

const PackageDownload = lazy(() => import("./PackageDownload"))

export const PackageDownloadModal = () => {
  const t = useT()
  const handler = (name: string) => {
    if (name === "package_download") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [show, setShow] = createSignal("pre_tips")
  return (
    <Modal
      blockScrollOnMount={false}
      opened={isOpen()}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      // size={{
      //   "@initial": "xs",
      //   "@md": "md",
      // }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("home.toolbar.package_download")}</ModalHeader>
        <Suspense fallback={<FullLoading />}>
          <Show
            when={show() === "pre_tips"}
            fallback={<PackageDownload onClose={onClose} />}
          >
            <ModalBody>
              <p>{t("home.toolbar.pre_package_download-tips")}</p>
            </ModalBody>
            <ModalFooter display="flex" gap="$2">
              <Button onClick={onClose} colorScheme="neutral">
                {t("global.cancel")}
              </Button>
              <Button
                colorScheme="info"
                onClick={() => {
                  setShow("package_download")
                }}
              >
                {t("global.confirm")}
              </Button>
            </ModalFooter>
          </Show>
        </Suspense>
      </ModalContent>
    </Modal>
  )
}
