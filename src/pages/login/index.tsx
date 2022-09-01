import {
  Image,
  Center,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  useColorModeValue,
  HStack,
  VStack,
  Checkbox,
} from "@hope-ui/solid";
import { createSignal, Show } from "solid-js";
import { SwitchColorMode, SwitchLnaguageWhite } from "~/components";
import { useFetch, useT, useTitle, useRouter } from "~/hooks";
import { changeToken, r, notify, handleRrespWithoutNotify } from "~/utils";
import { Resp } from "~/types";
import LoginBg from "./LoginBg";
import { createStorageSignal } from "@solid-primitives/storage";

const Login = () => {
  const t = useT();
  useTitle(() => t("login.title"));
  const bgColor = useColorModeValue("white", "$neutral1");
  const [username, setUsername] = createSignal(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = createSignal(
    localStorage.getItem("password") || ""
  );
  const [opt, setOpt] = createSignal("");
  const [remember, setRemember] = createStorageSignal("remember-pwd", "false");
  const [loading, data] = useFetch(() =>
    r.post("/auth/login", {
      username: username(),
      password: password(),
      otp_code: opt(),
    })
  );
  const { searchParams, to } = useRouter();
  const Login = async () => {
    if (remember()) {
      localStorage.setItem("username", username());
      localStorage.setItem("password", password());
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
    const resp: Resp<{ token: string }> = await data();
    handleRrespWithoutNotify(
      resp,
      (data) => {
        notify.success(t("login.success"));
        changeToken(data.token);
        to(decodeURIComponent(searchParams.redirect || "/"), true);
      },
      (msg, code) => {
        if (!needOpt() && code === 402) {
          setNeedOpt(true);
        } else {
          notify.error(msg);
        }
      }
    );
  };
  const [needOpt, setNeedOpt] = createSignal(false);

  return (
    <Center zIndex="1" w="$full" h="100vh">
      <VStack
        bgColor={bgColor()}
        rounded="$xl"
        p="24px"
        w={{
          "@initial": "90%",
          "@sm": "364px",
        }}
        spacing="$4"
      >
        <Flex alignItems="center" justifyContent="space-around">
          <Image
            boxSize="$12"
            src="https://jsd.nn.ci/gh/alist-org/logo@main/logo.svg"
          />
          <Heading color="$info9" fontSize="$2xl">
            {t("login.title")}
          </Heading>
        </Flex>
        <Show
          when={!needOpt()}
          fallback={
            <Input
              placeholder={t("login.otp-tips")}
              value={opt()}
              onChange={(e) => setOpt(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  Login();
                }
              }}
            />
          }
        >
          <Input
            placeholder={t("login.username-tips")}
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
          <Input
            placeholder={t("login.password-tips")}
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                Login();
              }
            }}
          />
          <Flex
            px="$1"
            w="$full"
            fontSize="$sm"
            color="$neutral10"
            justifyContent="space-between"
            alignItems="center"
          >
            <Checkbox
              checked={remember() === "true"}
              onChange={() =>
                setRemember(remember() === "true" ? "false" : "true")
              }
            >
              {t("login.remember")}
            </Checkbox>
            <Text>{t("login.forget")}</Text>
          </Flex>
        </Show>
        <HStack w="$full" spacing="$2">
          <Button
            colorScheme="primary"
            w="$full"
            onClick={() => {
              if (needOpt()) {
                setOpt("");
              } else {
                setUsername("");
                setPassword("");
              }
            }}
          >
            {t("login.clear")}
          </Button>
          <Button w="$full" loading={loading()} onClick={Login}>
            {t("login.login")}
          </Button>
        </HStack>
        <Button
          w="$full"
          colorScheme="accent"
          onClick={() => {
            changeToken();
            to(decodeURIComponent(searchParams.redirect || "/"), true);
          }}
        >
          {t("login.use_guest")}
        </Button>
        <Flex
          mt="$2"
          justifyContent="space-evenly"
          alignItems="center"
          color="$neutral10"
          w="$full"
        >
          <SwitchLnaguageWhite />
          <SwitchColorMode />
        </Flex>
      </VStack>
      <LoginBg />
    </Center>
  );
};

export default Login;
