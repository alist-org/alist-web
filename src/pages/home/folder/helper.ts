import { createKeyHold } from "@solid-primitives/keyboard"
import { createEffect, createSignal } from "solid-js"
import { local } from "~/store"

export function useOpenItemWithCheckbox() {
  const [shouldOpen, setShouldOpen] = createSignal(
    local["open_item_on_checkbox"] === "direct",
  )
  const isAltKeyPressed = createKeyHold("Alt")
  const isControlKeyPressed = createKeyHold("Control")
  createEffect(() => {
    switch (local["open_item_on_checkbox"]) {
      case "direct": {
        setShouldOpen(true)
        break
      }
      case "with_ctrl": {
        setShouldOpen(isControlKeyPressed())
        break
      }
      case "with_alt": {
        setShouldOpen(isAltKeyPressed())
      }
    }
  })
  return shouldOpen
}
