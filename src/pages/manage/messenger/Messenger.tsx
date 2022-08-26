import { Button, Heading, HStack, Input, VStack } from "@hope-ui/solid";
import { Component, createSignal, For, onCleanup } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { useFetch, useT } from "~/hooks";
import { Resp } from "~/types";
import {
  handleRrespWithNotifySuccess,
  handleRrespWithoutNotify,
  notify,
  r,
} from "~/utils";
import { StringShow, ImageShow } from "./Show";

export interface Message {
  type: string;
  content: any;
}

export const Shower: Record<string, Component<Message>> = {
  string: StringShow,
  image: ImageShow,
};

export const Messenger = () => {
  const t = useT();
  notify.info(t("manage.messenger-tips"));
  const [toSend, setToSend] = createSignal("");
  const [getLoading, getR] = useFetch(() => r.post("/admin/message/get"));
  const [sendLoading, sendR] = useFetch(() =>
    r.post("/admin/message/send", {
      message: toSend(),
    })
  );
  const [recieved, setRecieved] = createStore<Message[]>([]);
  const get = async () => {
    const resp: Resp<Message> = await getR();
    handleRrespWithoutNotify(resp, (msg) => {
      setRecieved(produce((msgs) => msgs.push(msg)));
    });
  };
  const send = async () => {
    const resp = await sendR();
    handleRrespWithNotifySuccess(resp);
  };
  const getInterval = setInterval(get, 1000);
  onCleanup(() => clearInterval(getInterval));
  return (
    <VStack spacing="$2" h="$full" alignItems="start">
      <VStack
        w="$full"
        spacing="$2"
        alignItems="start"
        p="$2"
        rounded="$lg"
        border="1px solid var(--hope-colors-neutral6)"
      >
        <Heading size="xl">{t("manage.recieved_msgs")}</Heading>
        <For each={recieved}>
          {(item) => <Dynamic component={Shower[item.type]} {...item} />}
        </For>
      </VStack>
      <Input
        w="$full"
        value={toSend()}
        onInput={(e) => setToSend(e.currentTarget.value)}
      />
      <HStack spacing="$2">
        <Button colorScheme="accent" loading={getLoading()} onClick={get}>
          {t("manage.recieve")}
        </Button>
        <Button loading={sendLoading()} onClick={send}>
          {t("manage.send")}
        </Button>
      </HStack>
    </VStack>
  );
};

export default Messenger;
