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
  Radio,
  RadioGroup,
  Input,
} from "@hope-ui/solid"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import {
  bus,
  fsBatchRename,
  handleRespWithNotifySuccess,
  notify,
} from "~/utils"
import { createSignal, For, onCleanup, Show } from "solid-js"
import { objStore } from "~/store"
import { RenameObj } from "~/types"
import { RenameItem } from "~/pages/home/toolbar/RenameItem"

export const BatchRename = () => {
  const {
    isOpen: isPreviewModalOpen,
    onOpen: openPreviewModal,
    onClose: closePreviewModal,
  } = createDisclosure()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsBatchRename)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const [type, setType] = createSignal("1")
  const [srcName, setSrcName] = createSignal("")
  const [newName, setNewName] = createSignal("")
  const [newNameType, setNewNameType] = createSignal("string")
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
    if (name === "batchRename") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })

  const submit = () => {
    if (!srcName() || !newName()) {
      // Check if both input values are not empty
      notify.warning(t("global.empty_input"))
      return
    }
    const replaceRegexp = new RegExp(srcName(), "g")

    let matchNames: RenameObj[]
    if (type() === "1") {
      matchNames = objStore.objs
        .filter((obj) => obj.name.match(srcName()))
        .map((obj) => {
          const renameObj: RenameObj = {
            src_name: obj.name,
            new_name: obj.name.replace(replaceRegexp, newName()),
          }
          return renameObj
        })
    } else {
      let tempNum = newName()
      matchNames = objStore.objs.map((obj) => {
        let suffix = ""
        const lastDotIndex = obj.name.lastIndexOf(".")
        if (lastDotIndex !== -1) {
          suffix = obj.name.substring(lastDotIndex + 1)
        }

        const renameObj: RenameObj = {
          src_name: obj.name,
          new_name: srcName() + tempNum + "." + suffix,
        }
        tempNum = (parseInt(tempNum) + 1)
          .toString()
          .padStart(tempNum.length, "0")
        return renameObj
      })
    }

    setMatchNames(matchNames)
    openPreviewModal()
    onClose()
  }

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        opened={isOpen()}
        onClose={onClose}
        initialFocus="#modal-input1"
        size={{
          "@initial": "xs",
          "@md": "md",
        }}
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalCloseButton /> */}
          <Show when={type() === "1"}>
            <ModalHeader>{t("home.toolbar.regular_rename")}</ModalHeader>
          </Show>
          <Show when={type() === "2"}>
            <ModalHeader>
              {t("home.toolbar.sequential_renaming_desc")}
            </ModalHeader>
          </Show>
          <ModalBody>
            <RadioGroup
              defaultValue="1"
              style={{ margin: "20px 0" }}
              onChange={(event) => {
                setType(event)
                if (event === "1") {
                  setNewNameType("string")
                } else if (event === "2") {
                  setNewNameType("number")
                }
              }}
            >
              <HStack spacing="$4">
                <Radio value="1">{t("home.toolbar.regex_rename")}</Radio>
                <Radio value="2">{t("home.toolbar.sequential_renaming")}</Radio>
              </HStack>
            </RadioGroup>
            <VStack spacing="$2">
              <Input
                id="modal-input1" // Update id to "modal-input1" for first input
                type={"string"}
                value={srcName()} // Update value to value1 for first input
                onInput={(e) => {
                  setSrcName(e.currentTarget.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submit()
                  }
                }}
              />
              <Input
                id="modal-input2" // Add second input with id "modal-input2"
                type={newNameType()}
                value={newName()} // Bind value to value2 for second input
                onInput={(e) => {
                  setNewName(e.currentTarget.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submit()
                  }
                }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter display="flex" gap="$2">
            <Button
              onClick={() => {
                setType("1")
                setNewNameType("string")
                onClose()
              }}
              colorScheme="neutral"
            >
              {t("global.cancel")}
            </Button>
            <Button
              onClick={() => submit()}
              disabled={!srcName() || !newName()}
            >
              {t("global.ok")}
            </Button>
          </ModalFooter>
        </ModalContent>
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
                setType("1")
                setNewNameType("string")
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
                const resp = await ok(pathname(), matchNames())
                handleRespWithNotifySuccess(resp, () => {
                  setMatchNames([])
                  setSrcName("")
                  setNewName("")
                  setType("1")
                  setNewNameType("string")
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
