// @ts-ignore
import { hljs } from "./highlight.js"
import SolidMarkdown from "solid-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import "./markdown.css"
import { onMount } from "solid-js"
import { clsx } from "clsx"

export const Markdown = (props: { children?: string; class?: string }) => {
  onMount(() => {
    hljs.highlightAll()
  })
  return (
    <SolidMarkdown
      class={clsx("markdown-body", props.class)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      children={props.children}
    />
  )
}
