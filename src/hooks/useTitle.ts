import { onCleanup } from "solid-js";

const useTitle = (title: string) => {
  const pre = document.title;
  document.title = title;
  onCleanup(() => {
    document.title = pre;
  });
};

export { useTitle };
