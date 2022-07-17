import { Resp } from "~/types";
import { notify } from "~/utils";
import { useRouter } from ".";

const useAuth = <T>(p: () => Promise<Resp<T>>): (() => Promise<any>) => {
  const { to } = useRouter();
  return async () => {
    const data = await p();
    if (data.code === 401) {
      notify.error(data.message);
      to(`/@login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
    return data;
  };
};

export { useAuth };
