import {
  Box,
  Center,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Spinner,
  useColorModeValue,
} from "@hope-ui/solid";
import { useI18n } from "@solid-primitives/i18n";
import { createSignal, For, Show } from "solid-js";
import { langMap, languages, loadedLangs } from "~/app/i18n";
import { TbLanguageHiragana } from "solid-icons/tb";
import { Portal } from "solid-js/web";

const [fetchingLang, setFetchingLang] = createSignal(false);

const SwitchLnaguage = () => {
  const [, { locale, add }] = useI18n();
  return (
    <Box>
      <Menu>
        <MenuTrigger
          as={TbLanguageHiragana}
          size={40}
          cursor="pointer"
        ></MenuTrigger>
        <MenuContent>
          <For each={languages}>
            {(lang, i) => (
              <MenuItem
                onSelect={async () => {
                  if (!loadedLangs.has(lang.code)) {
                    setFetchingLang(true);
                    add(lang.code, (await langMap[lang.code]()).default);
                    setFetchingLang(false);
                    loadedLangs.add(lang.code);
                  }
                  locale(lang.code);
                  localStorage.setItem("lang", lang.code);
                }}
              >
                {lang.lang}
              </MenuItem>
            )}
          </For>
        </MenuContent>
      </Menu>
      <Show when={fetchingLang()}>
        <Portal>
          <Center
            h="$full"
            w="$full"
            pos="fixed"
            top={0}
            bg={useColorModeValue("$blackAlpha4", "$whiteAlpha4")()}
            zIndex="100"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="$neutral4"
              color="$info10"
              size="xl"
            />
          </Center>
        </Portal>
      </Show>
    </Box>
  );
};

export { SwitchLnaguage };
