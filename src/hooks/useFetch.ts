import { Accessor } from "solid-js";
import { Resp } from "~/types";
import { useLoading } from ".";

const useFetch = <T>(
  p: () => Promise<Resp<T>>,
  loading?: boolean
): [Accessor<boolean>, () => Promise<any>] => {
  return useLoading(p, true, loading);
};

export { useFetch };
