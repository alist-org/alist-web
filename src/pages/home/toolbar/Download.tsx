import { Menu, MenuTrigger, MenuContent, MenuItem } from "@hope-ui/solid";
import { onCleanup } from "solid-js";
import { useT, useDownload } from "~/hooks";
import { bus } from "~/utils";
import { CenterIcon } from "./Icon";

export const Download = () => {
  const t = useT();
  const colorScheme = "neutral";
  const { batchDownloadSelected, sendToAria2 } = useDownload();
  return (
    <Menu placement="top" offset={10}>
      <MenuTrigger as={CenterIcon} name="download" />
      <MenuContent>
        <MenuItem colorScheme={colorScheme} onSelect={batchDownloadSelected}>
          {t("home.toolbar.batch_download")}
        </MenuItem>
        <MenuItem colorScheme={colorScheme} onSelect={() => {}}>
          {t("home.toolbar.package_download")}
        </MenuItem>
        <MenuItem colorScheme={colorScheme} onSelect={sendToAria2}>
          {t("home.toolbar.send_aria2")}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

export const PackageDownload = () => {
  bus.on("tool", (name) => {
    if (name === "package_download") {
    }
  });
  onCleanup(() => {
    bus.off("tool");
  });
  return <></>;
};
