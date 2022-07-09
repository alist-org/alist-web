import { createEffect, onCleanup } from "solid-js";

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

export { useTitle };
