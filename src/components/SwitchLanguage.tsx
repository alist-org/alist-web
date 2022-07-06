import { Icon, Menu, MenuContent, MenuItem, MenuTrigger } from "@hope-ui/solid";
import { useI18n } from "@solid-primitives/i18n";
import { For } from "solid-js";
import { languages } from "~/i18n";
import { TbLanguageHiragana } from "solid-icons/tb";

const SwitchLnaguage = () => {
  const [, { locale }] = useI18n();
  return (
    <Menu>
      <MenuTrigger as={TbLanguageHiragana} size={45}></MenuTrigger>
      <MenuContent>
        <For each={languages}>
          {(lang, i) => (
            <MenuItem
              colorScheme="info"
              onSelect={() => {
                locale(lang.lang);
              }}
            >
              {lang.text}
            </MenuItem>
          )}
        </For>
      </MenuContent>
    </Menu>
  );
};

export { SwitchLnaguage };
