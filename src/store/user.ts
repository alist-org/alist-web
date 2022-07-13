import { createSignal } from "solid-js";
import { Resp, User } from "~/types";
import { r } from "~/utils";
import { setState, State } from "./state";

const [user, setUser] = createSignal<User>();

export { user, setUser };
