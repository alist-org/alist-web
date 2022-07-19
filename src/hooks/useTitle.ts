import { createEffect, onCleanup } from "solid-js";
import { useT } from "./useT";

const useTitle = (title: string | (() => string)) => {
  const pre = document.title;
  if (typeof title === "function") {
    document.title = title();
    createEffect(() => {
      document.title = title();
    });
  } else {
    document.title = title;
  }
  onCleanup(() => {
    document.title = pre;
  });
};

export const useManageTitle = (title: string) => {
  const t = useT();
  useTitle(() => `${t(title)} - ${t("manage.title")}`);
};

export { useTitle };
