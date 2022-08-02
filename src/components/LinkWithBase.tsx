import { Link, LinkProps } from "@solidjs/router";
import { Anchor, AnchorProps, ElementType } from "@hope-ui/solid";
import { joinBase } from "~/utils";
export const LinkWithBase = (props: LinkProps) => (
  <Link {...props} href={joinBase(props.href)} />
);
export const AnchorWithBase = <C extends ElementType = "a">(
  props: AnchorProps<C>
) => <Anchor {...props} href={joinBase(props.href)} />;
