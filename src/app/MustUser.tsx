import { Center } from "@hope-ui/solid";
import { createSignal, JSXElement, Match, Switch } from "solid-js";
import { FullScreenLoading } from "~/components";
import { useLoading } from "~/hooks";
import { setUser } from "~/store";
import { Resp, User } from "~/types";
import { r } from "~/utils";

const MustUser = (props: { children: JSXElement }) => {
  const [loading, data] = useLoading(() => r.get("/auth/current"));
  const [err, setErr] = createSignal("");
  (async () => {
    const resp: Resp<User> = await data();
    if (resp.code === 200) {
      setUser(resp.data);
    } else {
      setErr(resp.message);
    }
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
