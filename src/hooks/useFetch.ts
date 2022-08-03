import { Accessor, createSignal } from "solid-js";
import { Resp } from "~/types";

export const useLoading = <T, D>(
  p: (arg: D) => Promise<T>,
  fetch?: boolean,
  t?: boolean // initial loading true
): [Accessor<boolean>, (arg: D) => Promise<any>] => {
  const [loading, setLoading] = createSignal<boolean>(t ?? false);
  return [
    loading,
    async (arg: D) => {
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

export const useFetch = <T, D>(
  p: (arg?: D) => Promise<Resp<T>>,
  loading?: boolean
): [Accessor<boolean>, (arg?: D) => Promise<any>] => {
  return useLoading(p, true, loading);
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

export const useListFetch = <T, K, D>(
  p: (key: K, arg?: D) => Promise<Resp<T>>,
  initial?: K
): [Accessor<K | undefined>, (key: K, arg?: D) => Promise<any>] => {
  return useListLoading(p, true, initial);
};
