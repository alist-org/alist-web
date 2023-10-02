import { Menu, Item, Submenu } from "solid-contextmenu"
import { useCopyLink, useDownload, useLink, useT } from "~/hooks"
import "solid-contextmenu/dist/style.css"
import { HStack, Icon, Text, useColorMode, Image } from "@hope-ui/solid"
import { operations } from "../toolbar/operations"
import { For } from "solid-js"
import { bus, convertURL, notify } from "~/utils"
import { ObjType, UserMethods, UserPermissions } from "~/types"
import { getSettingBool, me } from "~/store"
import { players } from "../previews/video_box"
import { BsPlayCircleFill } from "solid-icons/bs"

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
  const { rawLink } = useLink()
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
      <Submenu
        hidden={({ props }) => {
          return props.type !== ObjType.VIDEO
        }}
        label={
          <HStack spacing="$2">
            <Icon as={BsPlayCircleFill} boxSize="$7" p="$0_5" color="$info9" />
            <Text>{t("home.preview.play_with")}</Text>
          </HStack>
        }
      >
        <For each={players}>
          {(player) => (
            <Item
              onClick={({ props }) => {
                const href = convertURL(player.scheme, {
                  raw_url: "",
                  name: props.name,
                  d_url: rawLink(props, true),
                })
                window.open(href, "_self")
              }}
            >
              <HStack spacing="$2">
                <Image
                  m="0 auto"
                  boxSize="$7"
                  src={`${window.__dynamic_base__}/images/${player.icon}.webp`}
                />
                <Text>{player.name}</Text>
              </HStack>
            </Item>
          )}
        </For>
      </Submenu>
    </Menu>
  )
}
