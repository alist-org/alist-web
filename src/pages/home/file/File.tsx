import { Component, createMemo, lazy, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { objStore } from "~/store";
import { Obj, ObjType } from "~/types";
import { ext } from "~/utils";
import { CommonPreview } from "./Common";

interface FileType {
  type: ObjType;
  exts: string[];
}

const fileTypes = import.meta.glob("../preview/*.tsx", {
  import: "fileType",
  eager: true,
}) as Record<string, FileType>;

const previews = import.meta.glob("../preview/*.tsx", {
  // import: "default",
}) as Record<string, () => Promise<{ default: Component }>>;

const getPreview = (obj: Obj) => {
  for (const path in fileTypes) {
    const fileType = fileTypes[path];
    if (
      fileType.type === obj.type ||
      fileType.exts.includes(ext(obj.name).toLowerCase())
    ) {
      return lazy(previews[path]);
    }
  }
  return CommonPreview;
};

const File = () => {
  const preview = createMemo(() => getPreview(objStore.obj));
  return (
    <Show when={preview()}>
      <Dynamic component={preview()!} />
    </Show>
  );
};

export default File;
