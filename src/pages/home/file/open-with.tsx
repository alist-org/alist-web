import {
  Button,
  Icon,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@hope-ui/solid"
import { createMemo, For, Show } from "solid-js"
import { useLink, useT } from "~/hooks"
import { getExternalPreviews, objStore } from "~/store"
import { FaSolidAngleDown } from "solid-icons/fa"
import { convertURL } from "~/utils"

export const OpenWith = () => {
  const t = useT()
  const previews = createMemo(() => {
    return getExternalPreviews(objStore.obj.name)
  })
  const { currentObjLink } = useLink()
  return (
    <Show when={previews().length}>
      <Menu>
        <MenuTrigger
          as={Button}
          colorScheme="success"
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
                href={convertURL(preview.value, {
                  raw_url: objStore.raw_url,
                  name: objStore.obj.name,
                  d_url: currentObjLink(true),
                })}
              >
                {preview.key}
              </MenuItem>
            )}
          </For>
        </MenuContent>
      </Menu>
    </Show>
  )
}
