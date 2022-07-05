import { Box, Button, Grid, Heading, Input } from "@hope-ui/solid";
import { useI18n } from "@solid-primitives/i18n";

const Index = () => {
  const [t] = useI18n();
  return (
    <Grid justifyContent="center" alignItems="center" h="100vh">
      <Box>
        <Heading>{t("test.hello")}</Heading>
        <Button>Hello</Button>
        <Button colorScheme="success">Wolrd</Button>
        <Input />
      </Box>
    </Grid>
  );
};

export default Index;
