import { JSXElement, Match, Switch } from "solid-js"
import { getSetting } from "~/store"
import { Box, Container as HopeContainer } from "@hope-ui/solid"

export const Container = (props: { children: JSXElement }) => {
  const container = getSetting("home_container")
  return (
    <Switch fallback={<Box w="min(99%, 980px)">{props.children}</Box>}>
      <Match when={container === "hope_container"}>
        <HopeContainer>{props.children}</HopeContainer>
      </Match>
    </Switch>
  )
}
