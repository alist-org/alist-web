import { Text, VStack } from "@hope-ui/solid"

export const Plaintext = (props: { content?: string }) => {
  return (
    <VStack alignItems="flex-start">
      {props.content?.split(/\r\n|\n/)?.map((line) => (
        <Text size="base">{line}</Text>
      ))}
    </VStack>
  )
}
