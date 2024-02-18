import {
  Box,
  Button,
  createDisclosure,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@hope-ui/solid"
import { BiSolidRightArrow, BiSolidFolderOpen } from "solid-icons/bi"
import {
  Accessor,
  createContext,
  createSignal,
  useContext,
  Show,
  For,
  Setter,
  createEffect,
  on,
} from "solid-js"
import { useFetch, useT } from "~/hooks"
import { getMainColor, password } from "~/store"
import { Obj } from "~/types"
import {
  pathBase,
  handleResp,
  hoverColor,
  pathJoin,
  fsDirs,
  createMatcher,
} from "~/utils"

export type FolderTreeHandler = {
  setPath: Setter<string>
}
export interface FolderTreeProps {
  onChange: (path: string) => void
  forceRoot?: boolean
  autoOpen?: boolean
  handle?: (handler: FolderTreeHandler) => void
  showEmptyIcon?: boolean
}
interface FolderTreeContext extends Omit<FolderTreeProps, "handle"> {
  value: Accessor<string>
}
const context = createContext<FolderTreeContext>()
export const FolderTree = (props: FolderTreeProps) => {
  const [path, setPath] = createSignal("/")
  props.handle?.({ setPath })
  return (
    <Box class="folder-tree-box" w="$full" overflowX="auto">
      <context.Provider
        value={{
          value: path,
          onChange: (val) => {
            setPath(val)
            props.onChange(val)
          },
          autoOpen: props.autoOpen ?? false,
          forceRoot: props.forceRoot ?? false,
          showEmptyIcon: props.showEmptyIcon ?? false,
        }}
      >
        <FolderTreeNode path="/" />
      </context.Provider>
    </Box>
  )
}

const FolderTreeNode = (props: { path: string }) => {
  const [children, setChildren] = createSignal<Obj[]>()
  const { value, onChange, forceRoot, autoOpen, showEmptyIcon } =
    useContext(context)!
  const emptyIconVisible = () =>
    Boolean(showEmptyIcon && children() !== undefined && !children()?.length)
  const [loading, fetchDirs] = useFetch(() =>
    fsDirs(props.path, password(), forceRoot),
  )
  let isLoaded = false
  const load = async () => {
    if (children()?.length) return
    const resp = await fetchDirs() // this api may return null
    handleResp(
      resp,
      (data) => {
        isLoaded = true
        setChildren(data)
      },
      () => {
        if (isOpen()) onToggle() // close folder while failed
      },
    )
  }
  const { isOpen, onToggle } = createDisclosure()
  const active = () => value() === props.path
  const checkIfShouldOpen = async (pathname: string) => {
    if (!autoOpen) return
    if (createMatcher(props.path)(pathname)) {
      if (!isOpen()) onToggle()
      if (!isLoaded) load()
    }
  }
  createEffect(on(value, checkIfShouldOpen))
  return (
    <Box>
      <HStack spacing="$2">
        <Show
          when={!loading()}
          fallback={<Spinner size="sm" color={getMainColor()} />}
        >
          <Show
            when={!emptyIconVisible()}
            fallback={<Icon color={getMainColor()} as={BiSolidFolderOpen} />}
          >
            <Icon
              color={getMainColor()}
              as={BiSolidRightArrow}
              transform={isOpen() ? "rotate(90deg)" : "none"}
              transition="transform 0.2s"
              cursor="pointer"
              onClick={() => {
                onToggle()
                if (isOpen()) {
                  load()
                }
              }}
            />
          </Show>
        </Show>
        <Text
          css={{
            // textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          // overflow="hidden"
          fontSize="$md"
          cursor="pointer"
          px="$1"
          rounded="$md"
          bgColor={active() ? "$info8" : "transparent"}
          _hover={{
            bgColor: active() ? "$info8" : hoverColor(),
          }}
          onClick={() => {
            onChange(props.path)
          }}
        >
          {props.path === "/" ? "root" : pathBase(props.path)}
        </Text>
      </HStack>
      <Show when={isOpen()}>
        <VStack mt="$1" pl="$4" alignItems="start" spacing="$1">
          <For each={children()}>
            {(item) => (
              <FolderTreeNode path={pathJoin(props.path, item.name)} />
            )}
          </For>
        </VStack>
      </Show>
    </Box>
  )
}

export type ModalFolderChooseProps = {
  opened: boolean
  onClose: () => void
  onSubmit?: (text: string) => void
  type?: string
  defaultValue?: string
  loading?: boolean
}
export const ModalFolderChoose = (props: ModalFolderChooseProps) => {
  const t = useT()
  const [value, setValue] = createSignal(props.defaultValue ?? "")
  return (
    <Modal
      size="xl"
      blockScrollOnMount={false}
      opened={props.opened}
      onClose={props.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        {/* <ModalCloseButton /> */}
        <ModalHeader>{t("home.toolbar.choose_dst_folder")}</ModalHeader>
        <ModalBody>
          <FolderTree onChange={setValue} />
        </ModalBody>
        <ModalFooter display="flex" gap="$2">
          <Button onClick={props.onClose} colorScheme="neutral">
            {t("global.cancel")}
          </Button>
          <Button
            loading={props.loading}
            onClick={() => props.onSubmit?.(value())}
          >
            {t("global.ok")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const FolderChooseInput = (props: {
  value: string
  onChange: (path: string) => void
  id?: string
  onlyFolder?: boolean
}) => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const t = useT()
  return (
    <>
      <HStack w="$full" spacing="$2">
        <Input
          id={props.id}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          readOnly={props.onlyFolder}
          onClick={props.onlyFolder ? onOpen : () => {}}
          placeholder={t(
            `global.${
              props.onlyFolder ? "choose_folder" : "choose_or_input_path"
            }`,
          )}
        />
        <Show when={!props.onlyFolder}>
          <Button onClick={onOpen}>{t("global.choose")}</Button>
        </Show>
      </HStack>
      <Modal size="xl" opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{t("global.choose_folder")}</ModalHeader>
          <ModalBody>
            <FolderTree forceRoot onChange={props.onChange} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>{t("global.confirm")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
