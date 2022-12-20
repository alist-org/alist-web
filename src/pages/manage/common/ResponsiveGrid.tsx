import { Grid } from "@hope-ui/solid"
import { JSXElement } from "solid-js"
import { getSetting } from "~/store"

export const ResponsiveGrid = (props: { children: JSXElement }) => {
  const layout = getSetting("settings_layout")
  let v
  if (layout === "responsive") {
    v = "repeat(auto-fill, minmax(424px, 1fr))"
  }
  return (
    <Grid
      w="$full"
      gap="$2"
      templateColumns={{
        "@initial": "1fr",
        "@lg": v,
      }}
    >
      {props.children}
    </Grid>
  )
}
