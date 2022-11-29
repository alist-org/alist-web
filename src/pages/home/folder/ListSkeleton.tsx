import { Skeleton, VStack } from "@hope-ui/solid"
import { For } from "solid-js"

const ListSkeleton = () => {
  return (
    <VStack w="$full" spacing="$2">
      <For each={Array.from({ length: 10 })}>
        {() => <Skeleton rounded="$lg" w="$full" h="$8" />}
      </For>
    </VStack>
  )
}

export default ListSkeleton
