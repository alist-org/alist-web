import { Grid } from "@hope-ui/solid"
import { JSXElement } from "solid-js"

export const ResponsiveGrid = (props: { children: JSXElement }) => {
  return (
    <Grid
      w="$full"
      gap="$2"
      templateColumns={{
        "@initial": "1fr",
        "@lg": "repeat(auto-fill, minmax(424px, 1fr))",
      }}
    >
      {props.children}
    </Grid>
  )
}
