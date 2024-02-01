import { For, Show, createEffect, createSignal } from "solid-js"
import { createStorageSignal } from "@solid-primitives/storage"
import { Anchor, Box, List, ListItem } from "@hope-ui/solid"
import { Motion } from "@motionone/solid"
import { useScrollListener } from "~/pages/home/toolbar/BackTop.jsx"
import { isMobile } from "~/utils/compatibility"

type TocItem = { indent: number; text: string; tagName: string; key: string }

const [isTocVisible, setVisible] = createSignal(false)
const [markdownRef, setMarkdownRef] = createSignal<HTMLDivElement>()
const [isTocDisabled, setTocDisabled] = createStorageSignal(
  "isMarkdownTocDisabled",
  false,
  {
    serializer: (v: boolean) => JSON.stringify(v),
    deserializer: (v) => JSON.parse(v),
  },
)

export { isTocVisible, setMarkdownRef, setTocDisabled }

export function MarkdownToc() {
  if (isMobile) return null

  const [tocList, setTocList] = createSignal<TocItem[]>([])

  useScrollListener(
    () => setVisible(window.scrollY > 100 && tocList().length > 1),
    { immediate: true },
  )

  createEffect(() => {
    const $markdown = markdownRef()?.querySelector(".markdown-body")
    if (!$markdown) return

    /**
     * iterate elements of markdown body to find h1~h6
     * and put them into a list by order
     */
    const iterator = document.createNodeIterator(
      $markdown,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (/h1|h2|h3/i.test(node.nodeName)) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        },
      },
    )

    const items: TocItem[] = []
    let $next = iterator.nextNode()
    let minLevel = 6

    while ($next) {
      const level = Number($next.nodeName.match(/h(\d)/i)![1])
      if (level < minLevel) minLevel = level

      items.push({
        indent: level, // initial indent for following compute
        text: $next.textContent!,
        tagName: $next.nodeName.toLowerCase(),
        key: ($next as Element).getAttribute("key")!,
      })

      $next = iterator.nextNode()
    }

    setTocList(
      items.map((item) => ({
        ...item,
        // reset the indent of item to remove whitespace
        indent: item.indent - minLevel,
      })),
    )
  })

  const handleAnchor = (item: TocItem) => {
    const $target = document.querySelector(`${item.tagName}[key=${item.key}]`)
    if (!$target) return
    $target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <Show when={!isTocDisabled() && isTocVisible()}>
      <Box
        as={Motion.div}
        initial={{ x: 999 }}
        animate={{ x: 0 }}
        zIndex="$overlay"
        pos="fixed"
        right="$6"
        top="$6"
      >
        <Box
          mt="$5"
          p="$2"
          shadow="$xl"
          rounded="$lg"
          bgColor="$whiteAlpha12"
          transition="all .3s ease-out"
          transform="translateX(calc(100% - 28px))"
          _dark={{ bgColor: "$blackAlpha12" }}
          _hover={{ transform: "none" }}
        >
          <List maxH="60vh" overflowY="auto">
            <For each={tocList()}>
              {(item) => (
                <ListItem pl={15 * item.indent} m={4}>
                  <Anchor
                    color="rgb(24, 144, 255)"
                    onClick={() => handleAnchor(item)}
                  >
                    {item.text}
                  </Anchor>
                </ListItem>
              )}
            </For>
          </List>
        </Box>
      </Box>
    </Show>
  )
}
