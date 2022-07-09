import { useI18n } from "@solid-primitives/i18n";
import { firstUpperCase } from "~/utils/str";

const useT = () => {
  const [t] = useI18n();
  return (
    key: string,
    params?: Record<string, string> | undefined,
    defaultValue?: string | undefined
  ) => {
    const value = t(key, params, defaultValue);
    if (!value) {
      const last = key.slice(key.lastIndexOf(".") + 1);
      return firstUpperCase(last).split("_").join(" ");
    }
    return value;
  };
};

export { useT };
