import { Center } from "@hope-ui/solid";
import { createSignal, JSXElement, Match, Switch } from "solid-js";
import { FullScreenLoading } from "~/components";
import { useFetch } from "~/hooks";
import { setUser } from "~/store";
import { Resp, User } from "~/types";
import { r, handleRrespWithoutNotify } from "~/utils";

const MustUser = (props: { children: JSXElement }) => {
  const [loading, data] = useFetch(() => r.get("/auth/current"));
  const [err, setErr] = createSignal("");
  (async () => {
    const resp: Resp<User> = await data();
    if (resp.code === 200) {
      setUser(resp.data);
    } else {
      setErr(resp.message);
    }
    handleRrespWithoutNotify(await data(), setUser, setErr);
  })();
  return (
    <Switch fallback={props.children}>
      <Match when={loading()}>
        <FullScreenLoading />
      </Match>
      <Match when={err()}>
        <Center>{err()}</Center>
      </Match>
    </Switch>
  );
};

export { MustUser };
