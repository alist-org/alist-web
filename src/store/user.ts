import { createSignal } from "solid-js";
import { User } from "~/types";

const [user, setUser] = createSignal<User>();

export { user, setUser };
