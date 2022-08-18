import copy from "copy-to-clipboard";
import { createResource } from "solid-js";
import { objStore } from "~/store";
import { fetchText, notify } from "~/utils";
import { useT } from "./useT";
import { useUrl } from "./useUrl";

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
  const { proxyUrl } = useUrl();
  const fetchContent = async () => {
    return fetchText(proxyUrl(objStore.obj, true));
  };
  return createResource("", fetchContent);
};
