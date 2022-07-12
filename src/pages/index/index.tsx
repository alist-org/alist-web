import { Box, Button, Heading } from "@hope-ui/solid";
import { useRouter } from "~/hooks";

const Index = () => {
  const { pathname, push } = useRouter();
  return (
    <Box>
      <Heading>{pathname()}</Heading>
      <Button onClick={() => push("@login")}>login</Button>
    </Box>
  );
};

export default Index;
