import { ElementType, Icon, IconProps } from "@hope-ui/solid";

export const ToolIcon = <C extends ElementType = "svg">(
  props: IconProps<C>
) => (
  <Icon
    bgColor="$info4"
    color="$info11"
    _hover={{
      bgColor: "$info9",
      color: "white",
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
);

// export const ToolIcon = <C extends ElementType = "button">(
//   props: IconButtonProps<C>
// ) => <IconButton {...props} compact />;
