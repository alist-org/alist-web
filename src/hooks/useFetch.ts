import { Accessor } from "solid-js";
import { Resp } from "~/types";
import { useLoading, useListLoading } from ".";

const useFetch = <T, K>(
  p: (k?: K) => Promise<Resp<T>>,
  loading?: boolean
): [Accessor<boolean>, (k?: K) => Promise<any>] => {
  return useLoading(p, true, loading);
};

const useListFetch = <T, K, D>(
  p: (key: K, arg?: D) => Promise<Resp<T>>,
  initial?: K
): [Accessor<K | undefined>, (key: K, arg?: D) => Promise<any>] => {
  return useListLoading(p, true, initial);
};

export { useFetch, useListFetch };
