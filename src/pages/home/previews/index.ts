import { Component, lazy } from "solid-js"
import { getIframePreviews } from "~/store"
import { Obj, ObjType } from "~/types"
import { ext } from "~/utils"
import { generateIframePreview } from "./iframe"

export interface Preview {
  name: string
  type?: ObjType
  exts?: string[] | "*"
  provider?: RegExp
  component: Component
}

export type PreviewComponent = Pick<Preview, "name" | "component">

const previews: Preview[] = [
  {
    name: "Aliyun Video Previewer",
    type: ObjType.VIDEO,
    provider: /^Aliyundrive(Open)?$/,
    component: lazy(() => import("./aliyun_video")),
  },
  {
    name: "Markdown",
    type: ObjType.TEXT,
    component: lazy(() => import("./markdown")),
  },
  {
    name: "Markdown with word wrap",
    type: ObjType.TEXT,
    component: lazy(() => import("./markdown_with_word_wrap")),
  },
  {
    name: "Text Editor",
    type: ObjType.TEXT,
    component: lazy(() => import("./text-editor")),
  },
  {
    name: "HTML render",
    exts: ["html"],
    component: lazy(() => import("./html")),
  },
  {
    name: "Image",
    type: ObjType.IMAGE,
    component: lazy(() => import("./image")),
  },
  {
    name: "Video",
    type: ObjType.VIDEO,
    component: lazy(() => import("./video")),
  },
  {
    name: "Audio",
    type: ObjType.AUDIO,
    component: lazy(() => import("./audio")),
  },
  {
    name: "Ipa",
    exts: ["ipa"],
    component: lazy(() => import("./ipa")),
  },
  {
    name: "Plist",
    exts: ["plist"],
    component: lazy(() => import("./plist")),
  },
  {
    name: "Aliyun Office Previewer",
    exts: ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"],
    provider: /^Aliyundrive(Share)?$/,
    component: lazy(() => import("./aliyun_office")),
  },
]

export const getPreviews = (
  file: Obj & { provider: string }
): PreviewComponent[] => {
  const res: PreviewComponent[] = []
  // internal previews
  previews.forEach((preview) => {
    if (preview.provider && !preview.provider.test(file.provider)) {
      return
    }
    if (
      preview.type === file.type ||
      preview.exts === "*" ||
      preview.exts?.includes(ext(file.name).toLowerCase())
    ) {
      res.push({ name: preview.name, component: preview.component })
    }
  })
  // iframe previews
  const iframePreviews = getIframePreviews(file.name)
  iframePreviews.forEach((preview) => {
    res.push({
      name: preview.key,
      component: generateIframePreview(preview.value),
    })
  })
  // download page
  res.push({
    name: "Download",
    component: lazy(() => import("./download")),
  })
  return res
}
