import { Component, lazy } from "solid-js";
import { Obj, ObjType } from "~/types";
import { ext } from "~/utils";

export interface Preview {
  name: string;
  type?: ObjType;
  exts?: string[] | "*";
  provider?: RegExp;
  component: Component;
}

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
    name: "PDF",
    exts: ["pdf"],
    component: lazy(() => import("../previews/pdf")),
  },
  {
    name: "Video",
    type: ObjType.VIDEO,
    component: lazy(() => import("../previews/video")),
  },
];

export const previewRecord: Record<string, Component> = {
  Download: lazy(() => import("../previews/download")),
};
previews.forEach(({ name, component }) => {
  previewRecord[name] = component;
});

export const getPreviews = (file: Obj & { provider: string }): string[] => {
  const res: string[] = [];
  previews.forEach((preview) => {
    if (preview.provider && !preview.provider.test(file.provider)) {
      return;
    }
    if (
      preview.type === file.type ||
      preview.exts === "*" ||
      preview.exts?.includes(ext(file.name).toLowerCase())
    ) {
      res.push(preview.name);
    }
  });
  res.push("Download");
  return res;
};
