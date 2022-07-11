import { Accessor } from "solid-js";
import { createSignal } from "solid-js";

const useLoading = (
  p: () => Promise<any>
): [Accessor<boolean>, () => Promise<any>] => {
  const [loading, setLoading] = createSignal(false);
  return [
    loading,
    async () => {
      setLoading(true);
      const data = await p();
      setLoading(false);
      return data;
    },
  ];
};

export { useLoading };
