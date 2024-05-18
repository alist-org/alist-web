import { Checkbox, hope } from "@hope-ui/solid"
import { createKeyHold } from "@solid-primitives/keyboard"
import { createEffect, createSignal, onCleanup } from "solid-js"
import SelectionArea from "@viselect/vanilla"
import {
  checkboxOpen,
  haveSelected,
  local,
  objStore,
  oneChecked,
  selectAll,
  selectIndex,
} from "~/store"
import { isMac, isMobile } from "~/utils/compatibility"
import { useContextMenu } from "solid-contextmenu"

export function useOpenItemWithCheckbox() {
  const [shouldOpen, setShouldOpen] = createSignal(
    local["open_item_on_checkbox"] === "direct",
  )
  const isAltKeyPressed = createKeyHold("Alt", { preventDefault: false })
  const isMetaKeyPressed = createKeyHold("Meta", { preventDefault: false })
  const isControlKeyPressed = createKeyHold("Control", {
    preventDefault: false,
  })
  createEffect(() => {
    switch (local["open_item_on_checkbox"]) {
      case "direct": {
        setShouldOpen(true)
        break
      }
      case "disable_while_checked": {
        setShouldOpen(!haveSelected())
        break
      }
      case "with_ctrl": {
        // FYI why should use metaKey on a Mac
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey
        setShouldOpen(isMac ? isMetaKeyPressed() : isControlKeyPressed())
        break
      }
      case "with_alt": {
        setShouldOpen(isAltKeyPressed())
      }
    }
  })
  return shouldOpen
}

export function useSelectWithMouse() {
  const disabled = () => local["select_with_mouse"] === "disabled"

  const isMouseSupported = () => !isMobile && !disabled() && !checkboxOpen()

  const registerSelectContainer = () => {
    createEffect(() => {
      if (!isMouseSupported()) return
      const selection = new SelectionArea({
        selectionAreaClass: "viselect-selection-area",
        startAreas: [".viselect-container"],
        boundaries: [".viselect-container"],
        selectables: [".viselect-item"],
      })
      selection.on("start", ({ event }) => {
        const ev = event as MouseEvent
        selection.clearSelection(true, true)
        selection.select(".viselect-item.selected", true)
        if (!ev.ctrlKey && !ev.metaKey) {
          selectAll(false)
          selection.clearSelection()
        }
      })
      selection.on(
        "move",
        ({
          store: {
            changed: { added, removed },
          },
        }) => {
          for (const el of added) {
            selectIndex(Number(el.getAttribute("data-index")), true)
          }
          for (const el of removed) {
            selectIndex(Number(el.getAttribute("data-index")), false)
          }
        },
      )
      onCleanup(() => selection.destroy())
    })
  }

  const { show } = useContextMenu({ id: 1 })

  const captureContentMenu = (e: MouseEvent) => {
    e.preventDefault()

    if (haveSelected() && !oneChecked()) {
      const $target = e.target as Element
      const $selectedItem = $target.closest(".viselect-item")
      const index = Number($selectedItem?.getAttribute("data-index"))

      const isClickOnContainer = Number.isNaN(index)
      const isClickOnSelectedItems = () => !!objStore.objs[index].selected
      if (isClickOnContainer || !isClickOnSelectedItems()) return

      e.stopPropagation()
      show(e, { props: objStore.obj })
    }
  }

  return { isMouseSupported, registerSelectContainer, captureContentMenu }
}

export const ItemCheckbox = hope(Checkbox, {
  baseStyle: {
    // expand the range of click
    _before: {
      content: "",
      pos: "absolute",
      top: -10,
      right: -2,
      bottom: -10,
      left: -10,
    },
  },
})
