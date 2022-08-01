import { Box, Button, Container, Heading } from "@hope-ui/solid";
import { MaybeLoading } from "~/components";
import { useRouter } from "~/hooks";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Toolbar } from "./toolbar/Toolbar";

const Index = () => {
  const { pathname, push } = useRouter();
  return (
    <Container p="$2" pos="relative" minH="$full">
      <Header />
      <Toolbar />
      <Heading>{pathname()}</Heading>
      <Footer />
    </Container>
  );
};

export default Index;
