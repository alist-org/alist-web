import { Center, ElementType, Spinner, SpinnerProps } from "@hope-ui/solid";
import { JSXElement, mergeProps, Show } from "solid-js";
import { getIconColor } from "~/store";
const FullScreenLoading = () => {
  return (
    <Center h="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="$neutral4"
        color="$info10"
        size="xl"
      />
    </Center>
  );
};

export const FullLoading = (props: { py?: string }) => {
  const merged = mergeProps(
    {
      py: "$8",
    },
    props
  );
  return (
    <Center h="$full" w="$full" py={merged.py}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="$neutral4"
        color={getIconColor()}
        size="xl"
      />
    </Center>
  );
};

export const MaybeLoading = (props: {
  children?: JSXElement;
  loading: boolean;
}) => {
  return (
    <Show when={!props.loading} fallback={<FullLoading />}>
      {props.children}
    </Show>
  );
};

export const CenterLoding = <C extends ElementType = "div">(
  props: SpinnerProps<C>
) => {
  return (
    <Center w="$full" h="$full">
      <Spinner {...props} color={getIconColor()} />
    </Center>
  );
};
