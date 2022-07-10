import {Center,Spinner} from '@hope-ui/solid'
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

export {
  FullScreenLoading,
}