import {
  Image,
  Center,
  Flex,
  Heading,
  Box,
  Input,
  Button,
  useColorModeValue,
} from "@hope-ui/solid";
import { useI18n } from "@solid-primitives/i18n";
import { SwitchColorMode } from "~/components/SwitchColorMode";
import { useTitle } from "~/hooks/useTitle";
import LoginBg from "./LoginBg";

const Login = () => {
  const [t] = useI18n();
  useTitle(t("login.title"));
  const bgColor = useColorModeValue("#fff", "#18181c");
  const titleColor = useColorModeValue("#359eff", "#1890ff");
  return (
    <Center zIndex="1" w="$full" h="$full">
      <Box bgColor={bgColor()} rounded="$xl" p="24px">
        <Box
          w={{
            "@initial": "300px",
            "@sm": "360px",
          }}
        >
          <Flex alignItems="center" justifyContent="space-around" my="$1">
            <Image
              boxSize="$12"
              src="https://jsd.nn.ci/gh/alist-org/logo@main/logo.svg"
            />
            <Heading color={titleColor()} fontSize="$2xl">
              {t("login.title")}
            </Heading>
          </Flex>
          <Input placeholder={t("login.username-tip")} my="$2" />
          <Input placeholder={t("login.password-tip")} my="$2" />
          <Button w="$full" my="$2">
            {t("login.login")}
          </Button>
          <Button w="$full" my="$2" colorScheme="neutral">
            {t("login.use-guest")}
          </Button>
        </Box>
      </Box>
      <Box pos="absolute" right="$10" top="$10">
        <SwitchColorMode />
      </Box>
      <LoginBg />
    </Center>
  );
};

export default Login;
