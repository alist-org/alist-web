import { Accessor } from "solid-js";
import { createSignal } from "solid-js";
import { Resp } from "~/types";

const useLoading = <T>(
  p: () => Promise<T>,
  fetch?: boolean
): [Accessor<boolean>, () => Promise<any>] => {
  const [loading, setLoading] = createSignal(false);
  return [
    loading,
    async () => {
      setLoading(true);
      const data: unknown = await p();
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

export { useLoading };
