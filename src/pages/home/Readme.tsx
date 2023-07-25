import { Box, useColorModeValue } from "@hope-ui/solid"
import { createMemo, Show, createResource, on } from "solid-js"
import { Markdown, MaybeLoading } from "~/components"
import { useLink, useRouter } from "~/hooks"
import { objStore, recoverScroll, State } from "~/store"
import { fetchText } from "~/utils"

export const Readme = () => {
  const cardBg = useColorModeValue("white", "$neutral3")
  const { proxyLink } = useLink()
  const { pathname } = useRouter()
  const readme = createMemo(
    on(
      () => objStore.state,
      () => {
        if (
          ![State.FetchingMore, State.Folder, State.File].includes(
            objStore.state
          )
        ) {
          return ""
        }
        if ([State.FetchingMore, State.Folder].includes(objStore.state)) {
          const obj = objStore.objs.find(
            (item) => item.name.toLowerCase() === "readme.md"
          )
          if (obj) {
            return proxyLink(obj, true)
          }
        }
        if (objStore.readme) {
          return objStore.readme
        }
        return ""
      }
    )
  )
  const fetchContent = async (readme: string) => {
    let res = {
      content: readme,
    }
    if (/^https?:\/\//g.test(readme)) {
      res = await fetchText(readme)
    }
    setTimeout(() => {
      recoverScroll(pathname())
    })
    return res
  }
  const [content] = createResource(readme, fetchContent)
  return (
    <Show when={readme()}>
      <Box w="$full" rounded="$xl" p="$4" bgColor={cardBg()} shadow="$lg">
        <MaybeLoading loading={content.loading}>
          <Markdown children={content()?.content} />
        </MaybeLoading>
      </Box>
    </Show>
  )
}
