import { Box, useColorModeValue } from "@hope-ui/solid";
import CornerBottom from "./CornerBottom";
import CornerTop from "./CornerTop";

const LoginBg = () => {
  const bgColor = useColorModeValue("#dee8ff", "#a9c6ff");
  return (
    <Box
      bgColor={bgColor()}
      pos="absolute"
      overflow="hidden"
      zIndex="-1"
      w="$full"
      h="$full"
    >
      <Box
        pos="absolute"
        right={{
          "@initial": "-100px",
          "@sm": "-300px",
        }}
        top={{
          "@initial": "-1170px",
          "@sm": "-900px",
        }}
      >
        <CornerTop />
      </Box>
      <Box
        pos="absolute"
        left={{
          "@initial": "-100px",
          "@sm": "-200px",
        }}
        bottom={{
          "@initial": "-760px",
          "@sm": "-400px",
        }}
      >
        <CornerBottom />
      </Box>
    </Box>
  );
};

export default LoginBg;
