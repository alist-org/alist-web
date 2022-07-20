import { createEffect, onCleanup } from "solid-js";
import { useT } from "./useT";

let id = 0;
const effects: Record<string, boolean> = {};

const useTitle = (title: string | (() => string)) => {
  const cid = (id++).toString();
  const valids: string[] = [];
  for (const key in effects) {
    if (effects[key]) {
      valids.push(key);
      effects[key] = false;
    }
  }
  effects[cid] = true;
  const pre = document.title;
  if (typeof title === "function") {
    createEffect(() => {
      if (effects[cid]) {
        document.title = title();
      }
    });
  } else {
    document.title = title;
  }
  onCleanup(() => {
    document.title = pre;
    delete effects[cid];
    for (const key in valids) {
      effects[key] = true;
    }
  });
};

export const useManageTitle = (title: string) => {
  const t = useT();
  useTitle(() => `${t(title)} - ${t("manage.title")}`);
};

export { useTitle };
