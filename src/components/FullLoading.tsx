import { Center, Spinner } from "@hope-ui/solid";
import { JSXElement, Show } from "solid-js";
export const FullScreenLoading = () => {
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

export const FullLoading = () => {
  return (
    <Center h="$full" w="$full">
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
