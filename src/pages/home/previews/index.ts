import { Component, lazy } from "solid-js"
import { getIframePreviews } from "~/store"
import { Obj, ObjType } from "~/types"
import { ext } from "~/utils"
import { generateIframePreview } from "./iframe"
import { useRouter } from "~/hooks"

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
    name: "HTML render",
    exts: ["html"],
    component: lazy(() => import("./html")),
  },
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
    name: "Url Open",
    exts: ["url"],
    component: lazy(() => import("./url")),
  },
  {
    name: "Text Editor",
    type: ObjType.TEXT,
    exts: ["url"],
    component: lazy(() => import("./text-editor")),
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
    exts: ["ipa", "tipa"],
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
  {
    name: "Asciinema",
    exts: ["cast"],
    component: lazy(() => import("./asciinema")),
  },
]

export const getPreviews = (
  file: Obj & { provider: string },
): PreviewComponent[] => {
  const { searchParams } = useRouter()
  const typeOverride =
    ObjType[searchParams["type"]?.toUpperCase() as keyof typeof ObjType]
  const res: PreviewComponent[] = []
  // internal previews
  previews.forEach((preview) => {
    if (preview.provider && !preview.provider.test(file.provider)) {
      return
    }
    if (
      preview.type === file.type ||
      (typeOverride && preview.type === typeOverride) ||
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
