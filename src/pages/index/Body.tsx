import { Container, VStack, Heading } from "@hope-ui/solid";
import { useRouter } from "~/hooks";
import { Nav } from "./Nav";

export const Body = () => {
  return (
    <Container class="body" p="$2" minH="80%">
      <VStack w="$full" spacing="$2" alignItems="start">
        <Nav />
      </VStack>
    </Container>
  );
};
