import copy from "copy-to-clipboard";
import { notify } from "~/utils";
import { useT } from "./useT";

export const useUtil = () => {
  const t = useT();
  return {
    copy: (text: string) => {
      copy(text);
      notify.success(t("global.copied"));
    },
  };
};
