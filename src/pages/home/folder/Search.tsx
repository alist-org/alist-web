import {
  Badge,
  createDisclosure,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@hope-ui/solid"
import { BsSearch } from "solid-icons/bs"
import { createSignal, For, onCleanup, Show } from "solid-js"
import { LinkWithBase } from "~/components"
import { useFetch, useRouter, useT } from "~/hooks"
import { getMainColor, me } from "~/store"
import { Obj } from "~/types"
import { bus, fsSearch, getFileSize, handleResp, hoverColor } from "~/utils"
import { getIconByObj } from "~/utils/icon"

const SearchResult = (props: Obj) => {
  return (
    <HStack
      w="$full"
      borderBottom={`1px solid ${hoverColor()}`}
      _hover={{
        bgColor: hoverColor(),
      }}
      rounded="$md"
      cursor="pointer"
      px="$2"
      as={LinkWithBase}
      href={props.path}
    >
      <Icon
        class="icon"
        boxSize="$6"
        color={getMainColor()}
        as={getIconByObj(props)}
        mr="$1"
      />
      <VStack flex={1} p="$1" spacing="$1" w="$full" alignItems="start">
        <Text
          css={{
            wordBreak: "break-all",
          }}
        >
          {props.name}
          <Show when={!props.is_dir}>
            <Badge colorScheme="info" ml="$2">
              {getFileSize(props.size)}
            </Badge>
          </Show>
        </Text>
        <Text
          color="$neutral9"
          size="xs"
          css={{
            wordBreak: "break-all",
          }}
        >
          {props.path}
        </Text>
      </VStack>
    </HStack>
  )
}

const Search = () => {
  const { isOpen, onOpen, onClose, onToggle } = createDisclosure()
  const t = useT()
  const handler = (name: string) => {
    if (name === "search") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  const searchEvent = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
      e.preventDefault()
      onToggle()
    }
  }
  document.addEventListener("keydown", searchEvent)
  onCleanup(() => {
    bus.off("tool", handler)
    document.removeEventListener("keydown", searchEvent)
  })
  const [keywords, setKeywords] = createSignal("")
  const { pathname } = useRouter()
  const [loading, searchReq] = useFetch(fsSearch)
  const [data, setData] = createSignal<Obj[]>([])
  const search = async () => {
    const resp = await searchReq(pathname(), keywords())
    handleResp(resp, (data) => {
      if (!data) {
        return
      }
      data.forEach((obj) => {
        obj.path = obj.path.replace(me().base_path, "")
      })
      setData(data)
    })
  }
  return (
    <Modal
      // blockScrollOnMount={false}
      opened={isOpen()}
      onClose={onClose}
      closeOnEsc={false}
      size={{
        "@initial": "sm",
        "@sm": "lg",
        "@md": "2xl",
      }}
      initialFocus="#search-input"
      scrollBehavior="inside"
    >
      <ModalOverlay bg="$blackAlpha5" />
      <ModalContent mx="$2">
        <ModalCloseButton />
        <ModalHeader>{t("home.search.search")}</ModalHeader>
        <ModalBody>
          <VStack w="$full" spacing="$2">
            <HStack w="$full" spacing="$2">
              <Input
                id="search-input"
                value={keywords()}
                onInput={(e) => {
                  setKeywords(e.currentTarget.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    search()
                  }
                }}
              />
              <IconButton
                aria-label="search"
                icon={<BsSearch />}
                onClick={[search, undefined]}
                loading={loading()}
              />
            </HStack>
            <Show when={data().length === 0}>
              <Text size="2xl" my="$8">
                {t("home.search.no_result")}
              </Text>
            </Show>
            <VStack w="$full">
              <For each={data()}>{(item) => <SearchResult {...item} />}</For>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { Search }
