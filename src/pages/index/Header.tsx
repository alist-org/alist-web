import {
  Flex,
  HStack,
  useColorModeValue,
  Image,
  IconButton,
} from "@hope-ui/solid";
import { Show } from "solid-js";
import { getSetting, layout, setLayout, State, state } from "~/store";
import { BsGridFill } from "solid-icons/bs";
import { FaSolidListUl } from "solid-icons/fa";

export const Header = () => {
  const logos = getSetting("site_logo").split(",");
  const logo = useColorModeValue(logos[0], logos.pop());
  return (
    <Flex p="$2" justifyContent="space-between">
      <HStack>
        <Image src={logo()!} h="44px" w="auto" />
      </HStack>
      <HStack spacing="$2">
        <Show when={state() === State.Folder}>
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
    </Flex>
  );
};
