import { createSignal } from "solid-js";

const useLoading = (p: () => Promise<any>) => {
  const [loading, setLoading] = createSignal(false);
  return {
    loading,
    data: async () => {
      setLoading(true);
      const data = await p();
      setLoading(false);
      return data;
    },
  };
};

export { useLoading };
