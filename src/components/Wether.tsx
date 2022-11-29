import { Badge } from "@hope-ui/solid"
import { useT } from "~/hooks"

export interface WetherProps {
  yes?: boolean
}

export const Wether = (props: WetherProps) => {
  const t = useT()
  return (
    <Badge colorScheme={props.yes ? "success" : "danger"}>
      {t(`global.${props.yes ? "yes" : "no"}`)}
    </Badge>
  )
}
