import { Accessor, createSignal } from "solid-js";
import { Resp } from "~/types";

const useLoading = <T, K>(
  p: (arg?: K) => Promise<T>,
  fetch?: boolean,
  t?: boolean // initial loading true
): [Accessor<boolean>, (arg?: K) => Promise<any>] => {
  const [loading, setLoading] = createSignal<boolean>(t ?? false);
  return [
    loading,
    async (arg?: K) => {
      setLoading(true);
      const data: unknown = await p(arg);
      if (!fetch || (data as Resp<{}>).code !== 401) {
        // why?
        // because if setLoading(false) here will rerender before navigate
        // maybe cause some bugs
        setLoading(false);
      }
      return data;
    },
  ];
};

const useListLoading = <T, K, D>(
  p: (key: K, arg?: D) => Promise<T>,
  fetch?: boolean,
  initial?: K
): [Accessor<K | undefined>, (key: K, arg?: D) => Promise<any>] => {
  const [loading, setLoading] = createSignal<K | undefined>(initial);
  return [
    loading,
    async (key: K, arg?: D) => {
      setLoading(() => key);
      const data: unknown = await p(key, arg);
      if (!fetch || (data as Resp<{}>).code !== 401) {
        setLoading(undefined);
      }
      return data;
    },
  ];
};

export { useLoading, useListLoading };
