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

export const getPreviewURL = (
  placehoder: string,
  url: string,
  name: string
) => {
  let ans = placehoder;
  ans = ans.replace("$name", name);
  ans = ans.replace("$url", url);
  ans = ans.replace("$e_url", encodeURIComponent(url));
  ans = ans.replace("$b_url", window.btoa(url));
  ans = ans.replace("$eb_url", encodeURIComponent(window.btoa(url)));
  return ans;
};

export const ExternalPreview = () => {
  const t = useT();
  const previews = createMemo(() => {
    return getPreviewsByName(objStore.obj.name);
  });
  return (
    <Show when={previews()}>
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
                href={getPreviewURL(
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
