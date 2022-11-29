import { Link, LinkProps } from "@solidjs/router"
import { Anchor, AnchorProps, ElementType } from "@hope-ui/solid"
import { joinBase } from "~/utils"
import { useRouter } from "~/hooks"
export const LinkWithBase = (props: LinkProps) => (
  <Link {...props} href={joinBase(props.href)} />
)
export const AnchorWithBase = <C extends ElementType = "a">(
  props: AnchorProps<C>
) => <Anchor {...props} href={joinBase(props.href)} />

export const LinkWithPush = (props: LinkProps) => {
  const { pushHref } = useRouter()
  return <LinkWithBase {...props} href={pushHref(props.href)} />
}
