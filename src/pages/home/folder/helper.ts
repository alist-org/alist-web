import { createKeyHold } from "@solid-primitives/keyboard"
import { createEffect, createSignal, onCleanup } from "solid-js"
import SelectionArea from "@viselect/vanilla"
import { checkboxOpen, local, selectAll, selectIndex } from "~/store"
import { isMac, isMobile } from "~/utils/compatibility"

export function useOpenItemWithCheckbox() {
  const [shouldOpen, setShouldOpen] = createSignal(
    local["open_item_on_checkbox"] === "direct",
  )
  const isAltKeyPressed = createKeyHold("Alt")
  const isMetaKeyPressed = createKeyHold("Meta")
  const isControlKeyPressed = createKeyHold("Control")
  createEffect(() => {
    switch (local["open_item_on_checkbox"]) {
      case "direct": {
        setShouldOpen(true)
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

  return { isMouseSupported, registerSelectContainer }
}
