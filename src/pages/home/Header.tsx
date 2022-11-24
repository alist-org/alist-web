import {
  HStack,
  useColorModeValue,
  Image,
  IconButton,
  Center,
  Icon,
  Kbd,
} from "@hope-ui/solid"
import { Show } from "solid-js"
import { getSetting, layout, objStore, setLayout, State } from "~/store"
import { BsGridFill, BsSearch } from "solid-icons/bs"
import { FaSolidListUl } from "solid-icons/fa"
import { CenterLoading } from "~/components"
import { Container } from "./Container"
import { bus } from "~/utils"

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
              <IconButton
                aria-label="switch layout"
                compact
                size="lg"
                icon={
                  <Show when={layout() === "list"} fallback={<FaSolidListUl />}>
                    <BsGridFill />
                  </Show>
                }
                onClick={() => {
                  setLayout(layout() === "list" ? "grid" : "list")
                }}
              />
            </Show>
          </HStack>
        </HStack>
      </Container>
    </Center>
  )
}
