import {
  Button,
  createDisclosure,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@hope-ui/solid"
import { ModalTwoInput } from "~/components"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { bus, fsRegexRename, handleRespWithNotifySuccess } from "~/utils"
import { createSignal, For, onCleanup } from "solid-js"
import { objStore } from "~/store"
import { RenameObj } from "~/types"
import { RenameItem } from "~/pages/home/toolbar/RenameItem"

export const RegexRename = () => {
  const {
    isOpen: isPreviewModalOpen,
    onOpen: openPreviewModal,
    onClose: closePreviewModal,
  } = createDisclosure()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsRegexRename)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const [srcName, setSrcName] = createSignal("")
  const [newName, setNewName] = createSignal("")
  const [matchNames, setMatchNames] = createSignal<RenameObj[]>([])
  const t = useT()

  const itemProps = () => {
    return {
      fontWeight: "bold",
      fontSize: "$sm",
      color: "$neutral11",
      textAlign: "left" as any,
      cursor: "pointer",
    }
  }
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
    <>
      <Modal
        blockScrollOnMount={false}
        opened={isOpen()}
        onClose={() => onClose()}
        size={{
          "@initial": "xs",
          "@md": "md",
        }}
      >
        <ModalOverlay />

        <ModalTwoInput
          title="home.toolbar.regular_rename"
          opened={isOpen()}
          onClose={onClose}
          loading={loading()}
          defaultValue1={srcName()}
          defaultValue2={newName()}
          onSubmit={async (srcName, newName) => {
            const replaceRegexp = new RegExp(srcName, "g")

            const matchNames = objStore.objs
              .filter((obj) => obj.name.match(srcName))
              .map((obj) => {
                const renameObj: RenameObj = {
                  oldName: obj.name,
                  newName: obj.name.replace(replaceRegexp, newName),
                }
                return renameObj
              })
            setMatchNames(matchNames)
            setSrcName(srcName)
            setNewName(newName)
            openPreviewModal()
            onClose()
          }}
        />
      </Modal>

      <Modal
        size="xl"
        opened={isPreviewModalOpen()}
        onClose={closePreviewModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("home.toolbar.regex_rename_preview")}</ModalHeader>
          <ModalBody>
            <VStack class="list" w="$full" spacing="$1">
              <HStack class="title" w="$full" p="$2">
                <Text w={{ "@initial": "50%", "@md": "50%" }} {...itemProps()}>
                  {t("home.toolbar.regex_rename_preview_old_name")}
                </Text>
                <Text w={{ "@initial": "50%", "@md": "50%" }} {...itemProps()}>
                  {t("home.toolbar.regex_rename_preview_new_name")}
                </Text>
              </HStack>
              <For each={matchNames()}>
                {(obj, i) => {
                  return <RenameItem obj={obj} index={i()} />
                }}
              </For>
            </VStack>
          </ModalBody>
          <ModalFooter display="flex" gap="$2">
            <Button
              onClick={() => {
                setMatchNames([])
                closePreviewModal()
                onClose()
              }}
              colorScheme="neutral"
            >
              {t("global.cancel")}
            </Button>
            <Button
              onClick={() => {
                setMatchNames([])
                closePreviewModal()
                onOpen()
              }}
              colorScheme="neutral"
            >
              {t("global.back")}
            </Button>
            <Button
              loading={loading()}
              onClick={async () => {
                const resp = await ok(pathname(), srcName(), newName())
                handleRespWithNotifySuccess(resp, () => {
                  setMatchNames([])
                  setSrcName("")
                  setNewName("")
                  refresh()
                  onClose()
                  closePreviewModal()
                })
              }}
              disabled={matchNames().length == 0}
            >
              {t("global.ok")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
