import { Accessor, createSignal } from "solid-js";
import { Resp } from "~/types";

export const useLoading = <T>(
  p: (...arg: any[]) => Promise<T>,
  fetch?: boolean,
  t?: boolean // initial loading true
): [
  Accessor<boolean>,
  (...arg: any[]) => Promise<unknown extends T ? any : T>
] => {
  const [loading, setLoading] = createSignal<boolean>(t ?? false);
  return [
    loading,
    async (...arg: any[]) => {
      setLoading(true);
      const data = await p(...arg);
      if (!fetch || (data as unknown as Resp<{}>).code !== 401) {
        // why?
        // because if setLoading(false) here will rerender before navigate
        // maybe cause some bugs
        setLoading(false);
      }
      return data;
    },
  ];
};

export const useFetch = <T>(
  p: (...arg: any[]) => Promise<Resp<T>>,
  loading?: boolean
): [
  Accessor<boolean>,
  (...arg: Parameters<typeof p>) => Promise<Resp<unknown extends T ? any : T>>
] => {
  return useLoading(p, true, loading);
};

const useListLoading = <T, K>(
  p: (key: K, ...arg: any[]) => Promise<T>,
  fetch?: boolean,
  initial?: K
): [Accessor<K | undefined>, (key: K, ...arg: any[]) => Promise<any>] => {
  const [loading, setLoading] = createSignal<K | undefined>(initial);
  return [
    loading,
    async (key: K, ...arg: any[]) => {
      setLoading(() => key);
      const data: unknown = await p(key, ...arg);
      if (!fetch || (data as Resp<{}>).code !== 401) {
        setLoading(undefined);
      }
      return data;
    },
  ];
};

export const useListFetch = <T, K>(
  p: (key: K, ...arg: any[]) => Promise<Resp<T>>,
  initial?: K
): [Accessor<K | undefined>, (key: K, ...arg: any[]) => Promise<any>] => {
  return useListLoading(p, true, initial);
};
