import { HStack, VStack, Text } from "@hope-ui/solid"
import { batch, createEffect, createSignal, For, Show } from "solid-js"
import { useT } from "~/hooks"
import {
  allChecked,
  checkboxOpen,
  isIndeterminate,
  objStore,
  selectAll,
  sortObjs,
} from "~/store"
import { OrderBy } from "~/store"
import { Col, cols, ListItem } from "./ListItem"
import { ItemCheckbox, useSelectWithMouse } from "./helper"

const ListLayout = () => {
  const t = useT()
  const [orderBy, setOrderBy] = createSignal<OrderBy>()
  const [reverse, setReverse] = createSignal(false)
  createEffect(() => {
    if (orderBy()) {
      sortObjs(orderBy()!, reverse())
    }
  })
  const itemProps = (col: Col) => {
    return {
      fontWeight: "bold",
      fontSize: "$sm",
      color: "$neutral11",
      textAlign: col.textAlign as any,
      cursor: "pointer",
      onClick: () => {
        if (col.name === orderBy()) {
          setReverse(!reverse())
        } else {
          batch(() => {
            setOrderBy(col.name as OrderBy)
            setReverse(false)
          })
        }
      },
    }
  }
  const { isMouseSupported, registerSelectContainer, captureContentMenu } =
    useSelectWithMouse()
  registerSelectContainer()
  return (
    <VStack
      oncapture:contextmenu={captureContentMenu}
      classList={{ "viselect-container": isMouseSupported() }}
      class="list"
      w="$full"
      spacing="$1"
    >
      <HStack class="title" w="$full" p="$2">
        <HStack w={cols[0].w} spacing="$1">
          <Show when={checkboxOpen()}>
            <ItemCheckbox
              checked={allChecked()}
              indeterminate={isIndeterminate()}
              onChange={(e: any) => {
                selectAll(e.target.checked as boolean)
              }}
            />
          </Show>
          <Text {...itemProps(cols[0])}>{t(`home.obj.${cols[0].name}`)}</Text>
        </HStack>
        <Text w={cols[1].w} {...itemProps(cols[1])}>
          {t(`home.obj.${cols[1].name}`)}
        </Text>
        <Text
          w={cols[2].w}
          {...itemProps(cols[2])}
          display={{ "@initial": "none", "@md": "inline" }}
        >
          {t(`home.obj.${cols[2].name}`)}
        </Text>
      </HStack>
      <For each={objStore.objs}>
        {(obj, i) => {
          return <ListItem obj={obj} index={i()} />
        }}
      </For>
    </VStack>
  )
}

export default ListLayout
