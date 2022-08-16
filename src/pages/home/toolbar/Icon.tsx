import { ElementType, Icon, IconProps, Tooltip } from "@hope-ui/solid";
import { useT } from "~/hooks";
import { hoverColor } from "~/utils";

export const CenterIcon = <C extends ElementType = "svg">(
  props: IconProps<C> & {
    tip?: string;
  }
) => {
  const t = useT();
  return (
    <Tooltip
      disabled={!props.tip}
      placement="top"
      withArrow
      label={t(`home.toolbar.${props.tip}`)}
    >
      <Icon
        _hover={{
          bgColor: hoverColor(),
        }}
        _focus={{
          outline: "none",
        }}
        cursor="pointer"
        boxSize="$7"
        rounded="$md"
        p="$1"
        _active={{
          transform: "scale(.94)",
          transition: "0.2s",
        }}
        {...props}
      />
    </Tooltip>
  );
};

export const RightIcon = <C extends ElementType = "svg">(
  props: IconProps<C> & {
    tip?: string;
  }
) => {
  const t = useT();
  return (
    <Tooltip
      disabled={!props.tip}
      placement="left"
      withArrow
      label={t(`home.toolbar.${props.tip}`)}
    >
      <Icon
        bgColor="$info4"
        color="$info11"
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
        {...props}
      />
    </Tooltip>
  );
};

// export const ToolIcon = <C extends ElementType = "button">(
//   props: IconButtonProps<C>
// ) => <IconButton {...props} compact />;
