import { Menu, MenuTrigger, MenuContent, MenuItem } from "@hope-ui/solid";
import { useT, useCopyUrl } from "~/hooks";
import { CenterIcon } from "./Icon";

export const CopyURL = () => {
  const t = useT();
  const { copyPreviewPage, copyRawUrl } = useCopyUrl();
  const colorScheme = "neutral";
  return (
    <Menu placement="top" offset={10}>
      <MenuTrigger as="span">
        <CenterIcon name="copy_url" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            copyPreviewPage();
          }}
        >
          {t("home.toolbar.preview_page")}
        </MenuItem>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            copyRawUrl();
          }}
        >
          {t("home.toolbar.down_url")}
        </MenuItem>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            copyRawUrl(true);
          }}
        >
          {t("home.toolbar.encode_down_url")}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};
