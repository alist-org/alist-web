import { Box, VStack } from "@hope-ui/solid";
import { useI18n } from "@solid-primitives/i18n";
import { Paginator } from "~/components";
import Upload from "~/pages/home/toolbar/Upload";

const Index = () => {
  const [t] = useI18n();
  return (
    <VStack justifyContent="center" h="100vh">
      {/* <Paginator total={100} defaultPageSize={3} /> */}
      <Box w="$md">
        <Upload />
      </Box>
    </VStack>
  );
};

export default Index;
