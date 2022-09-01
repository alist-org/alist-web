import {
  HStack,
  useColorModeValue,
  Image,
  IconButton,
  Center,
} from "@hope-ui/solid";
import { Show } from "solid-js";
import { getSetting, layout, objStore, setLayout, State } from "~/store";
import { BsGridFill } from "solid-icons/bs";
import { FaSolidListUl } from "solid-icons/fa";
import { CenterLoding } from "~/components";
import { Container } from "./Container";

export const Header = () => {
  const logos = getSetting("logo").split(",");
  const logo = useColorModeValue(logos[0], logos.pop());
  return (
    <Center
      class="header"
      w="$full"
      // shadow="$md"
    >
      <Container>
        <HStack px="calc(2% + 0.5rem)" py="$2" w="$full" justifyContent="space-between">
          <HStack class="header-left" h="44px">
            <Image
              src={logo()!}
              h="$full"
              w="auto"
              fallback={<CenterLoding />}
            />
          </HStack>
          <HStack class="header-right" spacing="$2">
            <Show when={objStore.state === State.Folder}>
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
                  setLayout(layout() === "list" ? "grid" : "list");
                }}
              />
            </Show>
          </HStack>
        </HStack>
      </Container>
    </Center>
  );
};
