import { Menu, MenuTrigger, MenuContent, MenuItem } from "@hope-ui/solid"
import { useT, useCopyLink } from "~/hooks"
import { CenterIcon } from "./Icon"

export const CopyLink = () => {
  const t = useT()
  const { copySelectedPreviewPage, copySelectedRawLink } = useCopyLink()
  const colorScheme = "neutral"
  return (
    <Menu placement="top" offset={10}>
      <MenuTrigger as={CenterIcon} name="copy_link" />
      <MenuContent>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            copySelectedPreviewPage()
          }}
        >
          {t("home.toolbar.preview_page")}
        </MenuItem>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            copySelectedRawLink()
          }}
        >
          {t("home.toolbar.down_link")}
        </MenuItem>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            copySelectedRawLink(true)
          }}
        >
          {t("home.toolbar.encode_down_link")}
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
