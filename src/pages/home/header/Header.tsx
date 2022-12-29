import {
  HStack,
  useColorModeValue,
  Image,
  Center,
  Icon,
  Kbd,
} from "@hope-ui/solid"
import { Show } from "solid-js"
import { getSetting, objStore, State } from "~/store"
import { BsSearch } from "solid-icons/bs"
import { CenterLoading } from "~/components"
import { Container } from "../Container"
import { bus } from "~/utils"
import { Layout } from "./layout"

export const Header = () => {
  const logos = getSetting("logo").split("\n")
  const logo = useColorModeValue(logos[0], logos.pop())
  return (
    <Center
      class="header"
      w="$full"
      // shadow="$md"
    >
      <Container>
        <HStack
          px="calc(2% + 0.5rem)"
          py="$2"
          w="$full"
          justifyContent="space-between"
        >
          <HStack class="header-left" h="44px">
            <Image
              src={logo()!}
              h="$full"
              w="auto"
              fallback={<CenterLoading />}
            />
          </HStack>
          <HStack class="header-right" spacing="$2">
            <Show when={objStore.state === State.Folder}>
              <HStack
                bg="$neutral4"
                w="$32"
                p="$2"
                rounded="$md"
                justifyContent="space-between"
                border="2px solid transparent"
                cursor="pointer"
                _hover={{
                  borderColor: "$info6",
                }}
                onClick={() => {
                  bus.emit("tool", "search")
                }}
              >
                <Icon as={BsSearch} />
                <HStack>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </HStack>
              </HStack>
              <Layout />
            </Show>
          </HStack>
        </HStack>
      </Container>
    </Center>
  )
}
