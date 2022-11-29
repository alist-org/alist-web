import { Message } from "./Messenger"
import { Heading, Image } from "@hope-ui/solid"

export const StringShow = (props: Message) => {
  return <Heading>{props.content}</Heading>
}

export const ImageShow = (props: Message) => {
  return <Image src={props.content} />
}
