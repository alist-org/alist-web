import { useTitle } from "~/hooks";
import { getSetting } from "~/store";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Toolbar } from "./toolbar/Toolbar";

const Index = () => {
  useTitle(getSetting("site_title"));
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
