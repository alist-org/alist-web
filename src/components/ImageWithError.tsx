import { ElementType, Image, ImageProps } from "@hope-ui/solid"
import { createSignal, JSXElement, Show } from "solid-js"

export const ImageWithError = <C extends ElementType = "img">(
  props: ImageProps<C> & {
    fallbackErr?: JSXElement
  }
) => {
  const [err, setErr] = createSignal(false)
  return (
    <Show when={!err()} fallback={props.fallbackErr}>
      <Image
        {...props}
        onError={() => {
          setErr(true)
        }}
      />
    </Show>
  )
}
