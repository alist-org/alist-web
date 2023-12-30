// @ts-ignore
import { hljs } from "./highlight.js"
import SolidMarkdown from "solid-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import reMarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "./markdown.css"
import { Show, createEffect, createMemo, createSignal, on } from "solid-js"
import { clsx } from "clsx"
import { Box } from "@hope-ui/solid"
import { useParseText, useRouter } from "~/hooks"
import { EncodingSelect } from "."
import once from "just-once"
import { pathDir, pathJoin, api } from "~/utils"

const insertKatexCSS = once(() => {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href =
    "https://registry.npmmirror.com/katex/0.16.8/files/dist/katex.min.css"
  document.head.appendChild(link)
})

export function Markdown(props: {
  children?: string | ArrayBuffer
  class?: string
  ext?: string
  readme?: boolean
}) {
  const [encoding, setEncoding] = createSignal<string>("utf-8")
  const [show, setShow] = createSignal(true)
  const { isString, text } = useParseText(props.children)
  const convertToMd = (content: string) => {
    if (!props.ext || props.ext.toLocaleLowerCase() === "md") {
      return content
    }
    return "```" + props.ext + "\n" + content + "\n```"
  }
  const { pathname } = useRouter()
  const md = createMemo(() => {
    let content = convertToMd(text(encoding()))
    content = content.replace(/!\[.*?\]\((.*?)\)/g, (match) => {
      const name = match.match(/!\[(.*?)\]\(.*?\)/)![1]
      let url = match.match(/!\[.*?\]\((.*?)\)/)![1]
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("//")
      ) {
        return match
      }
      if (url.startsWith("/")) {
        url = `${api}/d${url}`
      } else {
        url = url.replace("./", "")
        url = `${api}/d${pathJoin(
          props.readme ? pathname() : pathDir(pathname()),
          url,
        )}`
      }
      const ans = `![${name}](${url})`
      console.log(ans)
      return ans
    })
    return content
  })
  createEffect(
    on(md, () => {
      setShow(false)
      insertKatexCSS()
      setTimeout(() => {
        setShow(true)
        hljs.highlightAll()
        window.onMDRender && window.onMDRender()
      })
    }),
  )
  return (
    <Box class="markdown" pos="relative" w="$full">
      <Show when={show()}>
        <SolidMarkdown
          class={clsx("markdown-body", props.class)}
          remarkPlugins={[remarkGfm, reMarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          children={md()}
        />
      </Show>
      <Show when={!isString}>
        <EncodingSelect encoding={encoding()} setEncoding={setEncoding} />
      </Show>
    </Box>
  )
}
