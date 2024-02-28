import { Center, VStack, Icon, Checkbox } from "@hope-ui/solid"
import { Motion } from "@motionone/solid"
import { useContextMenu } from "solid-contextmenu"
import { batch, createMemo, createSignal, Show } from "solid-js"
import { CenterLoading, ImageWithError } from "~/components"
import { useLink, usePath, useUtil } from "~/hooks"
import { checkboxOpen, getMainColor, selectAll, selectIndex } from "~/store"
import { ObjType, StoreObj } from "~/types"
import { bus } from "~/utils"
import { getIconByObj } from "~/utils/icon"
import { useOpenItemWithCheckbox } from "./helper"

export const ImageItem = (props: { obj: StoreObj; index: number }) => {
  const { isHide } = useUtil()
  if (isHide(props.obj) || props.obj.type !== ObjType.IMAGE) {
    return null
  }
  const { setPathAs } = usePath()
  const objIcon = (
    <Icon color={getMainColor()} boxSize="$12" as={getIconByObj(props.obj)} />
  )
  const [hover, setHover] = createSignal(false)
  const showCheckbox = createMemo(
    () => checkboxOpen() && (hover() || props.obj.selected),
  )
  const { show } = useContextMenu({ id: 1 })
  const { rawLink } = useLink()
  const isShouldOpenItem = useOpenItemWithCheckbox()
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        "flex-grow": 1,
      }}
    >
      <VStack
        w="$full"
        class="image-item"
        p="$1"
        spacing="$1"
        rounded="$lg"
        transition="all 0.3s"
        border="2px solid transparent"
        _hover={{
          border: `2px solid ${getMainColor()}`,
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
            selectAll(false)
            selectIndex(props.index, true, true)
          })
          show(e, { props: props.obj })
        }}
      >
        <Center w="$full" pos="relative">
          <Show when={showCheckbox()}>
            <Checkbox
              pos="absolute"
              left="$1"
              top="$1"
              checked={props.obj.selected}
              onChange={(e: any) => {
                selectIndex(props.index, e.target.checked)
              }}
            />
          </Show>
          <ImageWithError
            h="150px"
            w="$full"
            objectFit="cover"
            rounded="$lg"
            shadow="$md"
            fallback={<CenterLoading size="lg" />}
            fallbackErr={objIcon}
            src={rawLink(props.obj)}
            loading="lazy"
            cursor={
              !checkboxOpen() || isShouldOpenItem() ? "pointer" : "default"
            }
            on:click={(e: MouseEvent) => {
              if (!checkboxOpen() || e.altKey) {
                bus.emit("gallery", props.obj.name)
                return
              }
              selectIndex(props.index, !props.obj.selected)
            }}
          />
        </Center>
      </VStack>
    </Motion.div>
  )
}
