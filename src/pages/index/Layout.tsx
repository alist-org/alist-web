import { Box, Button, Container, Heading, VStack } from "@hope-ui/solid";
import { MaybeLoading } from "~/components";
import { useRouter } from "~/hooks";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Toolbar } from "./toolbar/Toolbar";

const Index = () => {
  
  return (
    <>
      <Header />
      <Toolbar />
      <Body />
      <Footer />
    </>
  );
};

export default Index;
