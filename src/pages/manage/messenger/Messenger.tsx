import { Button, Heading, HStack, Input, VStack } from "@hope-ui/solid"
import { Component, createSignal, For, onCleanup } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { Dynamic } from "solid-js/web"
import { useFetch, useT } from "~/hooks"
import { PEmptyResp, PResp } from "~/types"
import {
  handleRespWithNotifySuccess,
  handleRespWithoutNotify,
  notify,
  r,
} from "~/utils"
import { StringShow, ImageShow } from "./Show"

export interface Message {
  type: string
  content: any
}

export const Shower: Record<string, Component<Message>> = {
  string: StringShow,
  image: ImageShow,
}

export const Messenger = () => {
  const t = useT()
  notify.info(t("manage.messenger-tips"))
  const [toSend, setToSend] = createSignal("")
  const [getLoading, getR] = useFetch(
    (): PResp<Message> => r.post("/admin/message/get")
  )
  const [sendLoading, sendR] = useFetch(
    (): PEmptyResp =>
      r.post("/admin/message/send", {
        message: toSend(),
      })
  )
  const [received, setReceived] = createStore<Message[]>([])
  const get = async () => {
    const resp = await getR()
    handleRespWithoutNotify(resp, (msg) => {
      setReceived(produce((msgs) => msgs.push(msg)))
    })
  }
  const send = async () => {
    const resp = await sendR()
    handleRespWithNotifySuccess(resp)
  }
  const getInterval = setInterval(get, 1000)
  onCleanup(() => clearInterval(getInterval))
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
        <Heading size="xl">{t("manage.received_msgs")}</Heading>
        <For each={received}>
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
          {t("manage.receive")}
        </Button>
        <Button loading={sendLoading()} onClick={send}>
          {t("manage.send")}
        </Button>
      </HStack>
    </VStack>
  )
}

export default Messenger
