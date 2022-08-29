import copy from "copy-to-clipboard";
import { createResource } from "solid-js";
import { objStore } from "~/store";
import { fetchText, notify } from "~/utils";
import { useT, useLink } from ".";

export const useUtil = () => {
  const t = useT();
  return {
    copy: (text: string) => {
      copy(text);
      notify.success(t("global.copied"));
    },
  };
};

export const useFetchText = () => {
  const { proxyLink } = useLink();
  const fetchContent = async () => {
    return fetchText(proxyLink(objStore.obj, true));
  };
  return createResource("", fetchContent);
};
