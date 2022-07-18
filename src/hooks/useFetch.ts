import { Accessor } from "solid-js";
import { Resp } from "~/types";
import { useAuth, useLoading } from ".";

const useFetch = <T>(
  p: () => Promise<Resp<T>>,
  loading?: boolean,
  auth: boolean = true
): [Accessor<boolean>, () => Promise<any>] => {
  p = auth ? useAuth(p) : p;
  return useLoading(p, true, loading);
};

export { useFetch };
