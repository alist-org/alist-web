import { createSignal } from "solid-js";
import { User } from "~/types";

type Me = User & { otp: boolean };
const [user, setUser] = createSignal<Me>({} as Me);

export { user, setUser };
