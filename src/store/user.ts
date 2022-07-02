import { createSignal } from "solid-js";
import { Resp } from "~/pages/types/resp";
import { User } from "~/pages/types/user";
import { r } from "~/utils/request";

const [user, setUser] = createSignal<User>();
const resetUser = async () => {
  const resp: Resp<User> = (await r.get("/auth/current")).data;
  if (resp.code === 200) {
    setUser(resp.data);
  }
};

export { user, setUser };
