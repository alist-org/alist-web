import { createSignal } from "solid-js";
import { Resp, User } from "~/types";
import { r } from "~/utils";
import { setState, State } from "./state";

const [user, setUser] = createSignal<User>();
const resetUser = async () => {
  setState(State.FetchingCurrentUser);
  const resp: Resp<User> = await r.get("/auth/current");
  if (resp.code === 200) {
    setUser(resp.data);
    setState(State.FetchingCurrentUserSuccess);
  } else {
    setState(State.FetchingCurrentUserError);
  }
};

export { user, setUser, resetUser };
