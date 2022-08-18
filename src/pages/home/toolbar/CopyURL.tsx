import { Menu, MenuTrigger, MenuContent, MenuItem } from "@hope-ui/solid";
import { TbCopy } from "solid-icons/tb";
import { useT, useSelectedUrl, useUtil } from "~/hooks";
import { CenterIcon } from "./Icon";

export const CopyURL = () => {
  const t = useT();
  const { previewPage, rawUrl } = useSelectedUrl();
  const { copy } = useUtil();
  return (
    <Menu>
      <MenuTrigger as="span">
        <CenterIcon tip="copy_url" as={TbCopy} />
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          onSelect={() => {
            copy(previewPage());
          }}
        >
          {t("home.toolbar.preview_page")}
        </MenuItem>
        <MenuItem
          onSelect={() => {
            copy(rawUrl());
          }}
        >
          {t("home.toolbar.down_url")}
        </MenuItem>
        <MenuItem
          onSelect={() => {
            copy(rawUrl(true));
          }}
        >
          {t("home.toolbar.encode_down_url")}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};
