import { Menu, Item } from "solid-contextmenu"
import { useCopyLink, useDownload, useT } from "~/hooks"
import "solid-contextmenu/dist/style.css"
import { HStack, Icon, Text, useColorMode } from "@hope-ui/solid"
import { operations } from "../toolbar/operations"
import { For } from "solid-js"
import { bus, notify } from "~/utils"
import { UserMethods, UserPermissions } from "~/types"
import { getSettingBool, me } from "~/store"

const ItemContent = (props: { name: string }) => {
  const t = useT()
  return (
    <HStack spacing="$2">
      <Icon
        p={operations[props.name].p ? "$1" : undefined}
        as={operations[props.name].icon}
        boxSize="$7"
        color={operations[props.name].color}
      />
      <Text>{t(`home.toolbar.${props.name}`)}</Text>
    </HStack>
  )
}

export const ContextMenu = () => {
  const t = useT()
  const { colorMode } = useColorMode()
  const { copySelectedRawLink, copySelectedPreviewPage } = useCopyLink()
  const { batchDownloadSelected } = useDownload()
  const canPackageDownload = () => {
    return UserMethods.is_admin(me()) || getSettingBool("package_download")
  }
  return (
    <Menu
      id={1}
      animation="scale"
      theme={colorMode() !== "dark" ? "light" : "dark"}
    >
      <For each={["rename", "move", "copy", "delete"]}>
        {(name) => (
          <Item
            hidden={() => {
              const index = UserPermissions.findIndex((item) => item === name)
              return !UserMethods.can(me(), index)
            }}
            onClick={() => {
              bus.emit("tool", name)
            }}
          >
            <ItemContent name={name} />
          </Item>
        )}
      </For>
      <Item
        onClick={({ props }) => {
          if (props.is_dir) {
            copySelectedPreviewPage()
          } else {
            copySelectedRawLink(true)
          }
        }}
      >
        <ItemContent name="copy_link" />
      </Item>
      <Item
        onClick={({ props }) => {
          if (props.is_dir) {
            if (!canPackageDownload()) {
              notify.warning(t("home.toolbar.package_download_disabled"))
              return
            }
            bus.emit("tool", "package_download")
          } else {
            batchDownloadSelected()
          }
        }}
      >
        <ItemContent name="download" />
      </Item>
    </Menu>
  )
}
