import { Box, VStack } from "@hope-ui/solid"
import Upload from "~/pages/home/uploads/Upload"

const Index = () => {
  return (
    <VStack justifyContent="center" h="100vh">
      <Box w="$md">
        <Upload />
      </Box>
    </VStack>
  )
}

export default Index
