import { onMount, createSignal, onCleanup } from "solid-js"

const [isAltKeyPressed, setAltKeyState] = createSignal(false)

export const useAltKeyChange = () => {
  let isRegistered = false

  onMount(() => {
    if (isRegistered) return // prevent registering too many event listeners if using in a parent component

    const onKeyChange = (e: KeyboardEvent) => setAltKeyState(e.altKey)
    window.addEventListener("keydown", onKeyChange)
    window.addEventListener("keyup", onKeyChange)
    isRegistered = true

    onCleanup(() => {
      window.removeEventListener("keydown", onKeyChange)
      window.removeEventListener("keyup", onKeyChange)
      isRegistered = false
    })
  })

  return { isAltKeyPressed }
}
