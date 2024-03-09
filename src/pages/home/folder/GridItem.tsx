import { Center, VStack, Icon, Text, Checkbox } from "@hope-ui/solid"
import { Motion } from "@motionone/solid"
import { useContextMenu } from "solid-contextmenu"
import { batch, createMemo, createSignal, Show } from "solid-js"
import { CenterLoading, LinkWithPush, ImageWithError } from "~/components"
import { usePath, useRouter, useUtil } from "~/hooks"
import {
  checkboxOpen,
  getMainColor,
  local,
  selectAll,
  selectIndex,
} from "~/store"
import { ObjType, StoreObj } from "~/types"
import { bus, hoverColor } from "~/utils"
import { getIconByObj } from "~/utils/icon"
import { useOpenItemWithCheckbox, useSelectWithMouse } from "./helper"

export const GridItem = (props: { obj: StoreObj; index: number }) => {
  const { isHide } = useUtil()
  if (isHide(props.obj)) {
    return null
  }
  const { setPathAs } = usePath()
  const objIcon = (
    <Icon
      color={getMainColor()}
      boxSize={`${parseInt(local["grid_item_size"]) - 30}px`}
      as={getIconByObj(props.obj)}
    />
  )
  const [hover, setHover] = createSignal(false)
  const showCheckbox = createMemo(
    () => checkboxOpen() && (hover() || props.obj.selected),
  )
  const { show } = useContextMenu({ id: 1 })
  const { pushHref, to } = useRouter()
  const { isMouseSupported } = useSelectWithMouse()
  const isShouldOpenItem = useOpenItemWithCheckbox()
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        width: "100%",
      }}
    >
      <VStack
        classList={{ selected: !!props.obj.selected }}
        class="grid-item viselect-item"
        data-index={props.index}
        w="$full"
        p="$1"
        spacing="$1"
        rounded="$lg"
        transition="all 0.3s"
        _hover={{
          transform: "scale(1.06)",
          bgColor: hoverColor(),
        }}
        as={LinkWithPush}
        href={props.obj.name}
        cursor={
          !isMouseSupported() && (!checkboxOpen() || isShouldOpenItem())
            ? "pointer"
            : "default"
        }
        bgColor={props.obj.selected ? hoverColor() : undefined}
        on:dblclick={(e: MouseEvent) => {
          if (!isMouseSupported()) return
          if (e.ctrlKey || e.metaKey || e.shiftKey) return
          to(pushHref(props.obj.name))
        }}
        on:click={(e: MouseEvent) => {
          if (isMouseSupported()) return e.preventDefault()
          if (!checkboxOpen()) return
          e.preventDefault()
          if (isShouldOpenItem()) {
            to(pushHref(props.obj.name))
            return
          }
          selectIndex(props.index, !props.obj.selected)
        }}
        onMouseEnter={() => {
          setHover(true)
          setPathAs(props.obj.name, props.obj.is_dir, true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
        onContextMenu={(e: MouseEvent) => {
          batch(() => {
            // if (!checkboxOpen()) {
            //   toggleCheckbox();
            // }
            selectAll(false)
            selectIndex(props.index, true, true)
          })
          show(e, { props: props.obj })
        }}
      >
        <Center
          class="item-thumbnail"
          h={`${parseInt(local["grid_item_size"])}px`}
          w="$full"
          on:dblclick={(e: MouseEvent) => {
            if (!isMouseSupported()) return
            if (props.obj.type === ObjType.IMAGE) {
              e.stopPropagation()
              e.preventDefault()
              bus.emit("gallery", props.obj.name)
            }
          }}
          on:click={(e: MouseEvent) => {
            if (isMouseSupported()) return
            if (checkboxOpen() && !isShouldOpenItem()) return
            if (props.obj.type === ObjType.IMAGE) {
              e.stopPropagation()
              e.preventDefault()
              bus.emit("gallery", props.obj.name)
            }
          }}
          pos="relative"
        >
          <Show when={showCheckbox()}>
            <Checkbox
              pos="absolute"
              left="$1"
              top="$1"
              // colorScheme="neutral"
              on:click={(e: MouseEvent) => {
                e.stopPropagation()
              }}
              checked={props.obj.selected}
              onChange={(e: any) => {
                selectIndex(props.index, e.target.checked)
              }}
            />
          </Show>
          <Show when={props.obj.thumb} fallback={objIcon}>
            <ImageWithError
              maxH="$full"
              maxW="$full"
              rounded="$lg"
              shadow="$md"
              fallback={<CenterLoading size="lg" />}
              fallbackErr={objIcon}
              src={props.obj.thumb}
              loading="lazy"
            />
          </Show>
        </Center>
        <Text
          css={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          w="$full"
          overflow="hidden"
          textAlign="center"
          fontSize="$sm"
          title={props.obj.name}
        >
          {props.obj.name}
        </Text>
      </VStack>
    </Motion.div>
  )
}
