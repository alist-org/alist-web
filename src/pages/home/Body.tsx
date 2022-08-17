import { Container } from "@hope-ui/solid";
import { Nav } from "./Nav";
import { Obj } from "./Obj";
import { Readme } from "./Readme";

export const Body = () => {
  return (
    <Container
      // mt="$2"
      class="body"
      p="$2"
      minH="80%"
      display="flex"
      flexDirection="column"
      w="$full"
      gap="$2"
    >
      <Nav />
      <Obj />
      <Readme />
    </Container>
  );
};
