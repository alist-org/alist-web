import { Container, VStack, Heading } from "@hope-ui/solid";
import { useRouter } from "~/hooks";

export const Body = () => {
  const { pathname, push } = useRouter();
  return (
    <Container class="body" p="$2" minH="80%">
      <VStack w="$full" spacing="$2">
        <Heading>{pathname()}</Heading>
      </VStack>
    </Container>
  );
};
