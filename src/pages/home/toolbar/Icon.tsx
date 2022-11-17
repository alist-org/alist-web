import { ElementType, Icon, IconProps, Tooltip } from "@hope-ui/solid";
import { IconTypes } from "solid-icons";
import { useT } from "~/hooks";
import { getMainColor, me } from "~/store";
import { UserMethods, UserPermissions } from "~/types";
import { hoverColor } from "~/utils";
import { operations } from "./operations";

export const CenterIcon = <C extends ElementType = "svg">(
  props: IconProps<C> & {
    name: string;
  }
) => {
  const index = UserPermissions.findIndex((p) => p === props.name);
  if (index !== -1 && !UserMethods.can(me(), index)) return null;
  const t = useT();
  return (
    <Tooltip placement="top" withArrow label={t(`home.toolbar.${props.name}`)}>
      <Icon
        class={`toolbar-${props.name}`}
        _hover={{
          bgColor: hoverColor(),
        }}
        _focus={{
          outline: "none",
        }}
        cursor="pointer"
        boxSize="$7"
        rounded="$md"
        p={operations[props.name]?.p ? "$1_5" : "$1"}
        _active={{
          transform: "scale(.94)",
          transition: "0.2s",
        }}
        as={operations[props.name]?.icon}
        color={operations[props.name]?.color}
        {...props}
      />
    </Tooltip>
  );
};

export const RightIcon = <C extends ElementType = "svg">(
  props: IconProps<C> & {
    tips?: string;
    icon?: IconTypes;
  }
) => {
  const t = useT();
  return (
    <Tooltip
      disabled={!props.tips}
      placement="left"
      withArrow
      label={t(`home.toolbar.${props.tips}`)}
    >
      <Icon
        // bgColor="$info4"
        color="$info9"
        _hover={{
          bgColor: "$info9",
          color: "white",
        }}
        _focus={{
          outline: "none",
        }}
        cursor="pointer"
        boxSize="$8"
        rounded="$lg"
        p="$1"
        _active={{
          transform: "scale(.94)",
          transition: "0.2s",
        }}
        as={props.icon}
        {...props}
      />
    </Tooltip>
  );
};

// export const ToolIcon = <C extends ElementType = "button">(
//   props: IconButtonProps<C>
// ) => <IconButton {...props} compact />;
