// @ts-ignore
import { hljs } from "./highlight.js"
import SolidMarkdown from "solid-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import "./markdown.css"
import { onMount } from "solid-js"

export const Markdown = (props: { children?: string }) => {
  onMount(() => {
    hljs.highlightAll()
  })
  return (
    <SolidMarkdown
      class="markdown-body"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      children={props.children}
    />
  )
}
