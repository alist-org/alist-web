import { Box, Button, Container, Heading, VStack } from "@hope-ui/solid";
import { MaybeLoading } from "~/components";
import { useRouter } from "~/hooks";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Toolbar } from "./toolbar/Toolbar";

const Index = () => {
  const { pathname, push } = useRouter();
  return (
    <Container p="$2" h="$full">
      <Header />
      <Toolbar />
      <VStack w="$full" spacing="$2" minH="70%">
        <Heading>{pathname()}</Heading>
      </VStack>
      <Footer />
    </Container>
  );
};

export default Index;
