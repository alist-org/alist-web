import SolidMarkdown from "solid-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "./markdown.css";

export const Markdown = (props: { children?: string }) => {
  return (
    <SolidMarkdown
      class="markdown-body"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeHighlight, { ignoreMissing: true }]]}
      children={props.children}
    />
  );
};
