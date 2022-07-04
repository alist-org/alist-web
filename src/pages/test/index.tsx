import { Box, Button, Center, Heading } from "@hope-ui/solid";
import { useI18n } from "@solid-primitives/i18n";

const Index = () => {
  const [t] = useI18n();
  return (
    <Center h="100vh">
      <Box>
        <Heading>{t("test.hello")}</Heading>
        <Button>Hello</Button>
        <Button colorScheme="success">Wolrd</Button>
      </Box>
    </Center>
  );
};

export default Index;
