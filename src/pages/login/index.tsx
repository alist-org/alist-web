import {
  Image,
  Center,
  Flex,
  Heading,
  Box,
  Input,
  Button,
  useColorModeValue,
  HStack,
  notificationService,
} from "@hope-ui/solid";
import { useI18n } from "@solid-primitives/i18n";
import { createSignal } from "solid-js";
import { SwitchColorMode } from "~/components/SwitchColorMode";
import { SwitchLnaguage } from "~/components/SwitchLanguage";
import { useLoading } from "~/hooks/useLoading";
import { useT } from "~/hooks/useT";
import { useTitle } from "~/hooks/useTitle";
import { changeToken, r } from "~/utils/request";
import { Resp } from "../types/resp";
import LoginBg from "./LoginBg";

const Login = () => {
  const t = useT();
  useTitle(t("login.title"));
  const bgColor = useColorModeValue("#fff", "#18181c");
  const titleColor = useColorModeValue("#359eff", "#1890ff");
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  // const [loading, setLoading] = createSignal(false);
  const { loading, data } = useLoading(() =>
    r.post("/auth/login", {
      username: username(),
      password: password(),
    })
  );
  const Login = async () => {
    const resp: Resp<{ token: string }> = await data();
    if (resp.code === 200) {
      notificationService.show({
        status: "success",
        title: t("login.success"),
      });
      changeToken(resp.data.token);
      // TODO go to redirect url
    } else {
      notificationService.show({
        status: "danger",
        title: resp.message,
      });
    }
  };
  return (
    <Center zIndex="1" w="$full" h="$full">
      <Box
        bgColor={bgColor()}
        rounded="$xl"
        p="24px"
        w={{
          "@initial": "90%",
          "@sm": "364px",
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
        <Input
          placeholder={t("login.username-tip")}
          my="$2"
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
        <Input
          placeholder={t("login.password-tip")}
          my="$2"
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              Login();
            }
          }}
        />
        <Button w="$full" my="$2" loading={loading()} onClick={Login}>
          {t("login.login")}
        </Button>
        <Button
          w="$full"
          my="$2"
          colorScheme="accent"
          onClick={() => {
            changeToken("");
          }}
        >
          {t("login.use-guest")}
        </Button>
        <Flex mt="$2" justifyContent="space-evenly" color="$neutral10">
          <SwitchLnaguage />
          <SwitchColorMode />
        </Flex>
      </Box>
      <LoginBg />
    </Center>
  );
};

export default Login;
