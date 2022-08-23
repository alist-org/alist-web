import { type } from "os";
import { Component, lazy } from "solid-js";
import { getIframePreviews } from "~/store";
import { Obj, ObjType } from "~/types";
import { ext } from "~/utils";
import { generateIframePreview } from "../previews/iframe";

export interface Preview {
  name: string;
  type?: ObjType;
  exts?: string[] | "*";
  provider?: RegExp;
  component: Component;
}

export type PreviewComponent = Pick<Preview, "name" | "component">;

const previews: Preview[] = [
  {
    name: "Markdown",
    type: ObjType.TEXT,
    component: lazy(() => import("../previews/markdown")),
  },
  {
    name: "Text Editor",
    type: ObjType.TEXT,
    component: lazy(() => import("../previews/text-editor")),
  },
  {
    name: "HTML render",
    exts: ["html"],
    component: lazy(() => import("../previews/html")),
  },
  {
    name: "Image",
    type: ObjType.IMAGE,
    component: lazy(() => import("../previews/image")),
  },
  {
    name: "Video",
    type: ObjType.VIDEO,
    component: lazy(() => import("../previews/video")),
  },
];

export const getPreviews = (
  file: Obj & { provider: string }
): PreviewComponent[] => {
  const res: PreviewComponent[] = [];
  // internal previews
  previews.forEach((preview) => {
    if (preview.provider && !preview.provider.test(file.provider)) {
      return;
    }
    if (
      preview.type === file.type ||
      preview.exts === "*" ||
      preview.exts?.includes(ext(file.name).toLowerCase())
    ) {
      res.push({ name: preview.name, component: preview.component });
    }
  });
  // iframe previews
  const iframePreviews = getIframePreviews(file.name);
  iframePreviews.forEach((preview) => {
    res.push({
      name: preview.key,
      component: generateIframePreview(preview.value),
    });
  });
  // download page
  res.push({
    name: "Download",
    component: lazy(() => import("../previews/download")),
  });
  return res;
};
