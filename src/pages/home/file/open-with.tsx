import {
  Button,
  Icon,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@hope-ui/solid";
import { createMemo, For, Show } from "solid-js";
import { useT } from "~/hooks";
import { getPreviewsByName, objStore } from "~/store";
import { FaSolidAngleDown } from "solid-icons/fa";
import { convertURL } from "~/utils";

export const OpenWith = () => {
  const t = useT();
  const previews = createMemo(() => {
    return getPreviewsByName(objStore.obj.name);
  });
  return (
    <Show when={previews().length}>
      <Menu>
        <MenuTrigger
          as={Button}
          colorScheme="accent"
          rightIcon={<Icon as={FaSolidAngleDown} />}
        >
          {t("home.preview.open_with")}
        </MenuTrigger>
        <MenuContent>
          <For each={previews()}>
            {(preview) => (
              <MenuItem
                as="a"
                target="_blank"
                href={convertURL(
                  preview.value,
                  objStore.raw_url,
                  objStore.obj.name
                )}
              >
                {preview.key}
              </MenuItem>
            )}
          </For>
        </MenuContent>
      </Menu>
    </Show>
  );
};
