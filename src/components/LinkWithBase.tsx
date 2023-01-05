import { Link } from "@solidjs/router"
import { Anchor, AnchorProps, ElementType } from "@hope-ui/solid"
import { joinBase, encodePath } from "~/utils"
import { useRouter } from "~/hooks"
import { ComponentProps } from "solid-js"

export const LinkWithBase = (
  props: ComponentProps<typeof Link> & { encode?: boolean }
) => (
  <Link
    {...props}
    href={joinBase(props.encode ? encodePath(props.href) : props.href)}
  />
)

export const AnchorWithBase = <C extends ElementType = "a">(
  props: AnchorProps<C>
) => <Anchor {...props} href={joinBase(props.href)} />

export const LinkWithPush = (props: ComponentProps<typeof LinkWithBase>) => {
  const { pushHref } = useRouter()
  return <LinkWithBase {...props} href={pushHref(props.href)} />
}
