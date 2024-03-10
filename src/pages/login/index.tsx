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
  Icon,
} from "@hope-ui/solid"
import { createMemo, createSignal, Show } from "solid-js"
import { SwitchColorMode, SwitchLanguageWhite } from "~/components"
import { useFetch, useT, useTitle, useRouter } from "~/hooks"
import {
  changeToken,
  r,
  notify,
  handleRespWithoutNotify,
  base_path,
  handleResp,
  hashPwd,
} from "~/utils"
import { PResp, Resp } from "~/types"
import LoginBg from "./LoginBg"
import { createStorageSignal } from "@solid-primitives/storage"
import { getSetting, getSettingBool } from "~/store"
import { SSOLogin } from "./SSOLogin"
import { IoFingerPrint } from "solid-icons/io"
import {
  parseRequestOptionsFromJSON,
  get,
  AuthenticationPublicKeyCredential,
  supported,
  CredentialRequestOptionsJSON,
} from "@github/webauthn-json/browser-ponyfill"

const Login = () => {
  const logos = getSetting("logo").split("\n")
  const logo = useColorModeValue(logos[0], logos.pop())
  const t = useT()
  const title = createMemo(() => {
    return `${t("login.login_to")} ${getSetting("site_title")}`
  })
  useTitle(title)
  const bgColor = useColorModeValue("white", "$neutral1")
  const [username, setUsername] = createSignal(
    localStorage.getItem("username") || "",
  )
  const [password, setPassword] = createSignal(
    localStorage.getItem("password") || "",
  )
  const [opt, setOpt] = createSignal("")
  const [useauthn, setuseauthn] = createSignal(false)
  const [remember, setRemember] = createStorageSignal("remember-pwd", "false")
  const [useLdap, setUseLdap] = createSignal(false)
  const [loading, data] = useFetch(
    async (): Promise<Resp<{ token: string }>> => {
      if (useLdap()) {
        return r.post("/auth/login/ldap", {
          username: username(),
          password: password(),
          otp_code: opt(),
        })
      } else {
        return r.post("/auth/login/hash", {
          username: username(),
          password: hashPwd(password()),
          otp_code: opt(),
        })
      }
    },
  )
  const [, postauthnlogin] = useFetch(
    (
      session: string,
      credentials: AuthenticationPublicKeyCredential,
      username: string,
    ): Promise<Resp<{ token: string }>> =>
      r.post(
        "/authn/webauthn_finish_login?username=" + username,
        JSON.stringify(credentials),
        {
          headers: {
            session: session,
          },
        },
      ),
  )
  interface Webauthntemp {
    session: string
    options: CredentialRequestOptionsJSON
  }
  const [, getauthntemp] = useFetch(
    (username): PResp<Webauthntemp> =>
      r.get("/authn/webauthn_begin_login?username=" + username),
  )
  const { searchParams, to } = useRouter()
  const AuthnSignEnabled = getSettingBool("webauthn_login_enabled")
  const AuthnSwitch = async () => {
    setuseauthn(!useauthn())
  }
  const Login = async () => {
    if (!useauthn()) {
      if (remember() === "true") {
        localStorage.setItem("username", username())
        localStorage.setItem("password", password())
      } else {
        localStorage.removeItem("username")
        localStorage.removeItem("password")
      }
      const resp = await data()
      handleRespWithoutNotify(
        resp,
        (data) => {
          notify.success(t("login.success"))
          changeToken(data.token)
          to(
            decodeURIComponent(searchParams.redirect || base_path || "/"),
            true,
          )
        },
        (msg, code) => {
          if (!needOpt() && code === 402) {
            setNeedOpt(true)
          } else {
            notify.error(msg)
          }
        },
      )
    } else {
      if (!supported()) {
        notify.error(t("users.webauthn_not_supported"))
        return
      }
      changeToken()
      if (remember() === "true") {
        localStorage.setItem("username", username())
      } else {
        localStorage.removeItem("username")
      }
      const resp = await getauthntemp(username())
      handleResp(resp, async (data) => {
        try {
          const options = parseRequestOptionsFromJSON(data.options)
          const credentials = await get(options)
          const resp = await postauthnlogin(
            data.session,
            credentials,
            username(),
          )
          handleRespWithoutNotify(resp, (data) => {
            notify.success(t("login.success"))
            changeToken(data.token)
            to(
              decodeURIComponent(searchParams.redirect || base_path || "/"),
              true,
            )
          })
        } catch (error: unknown) {
          if (error instanceof Error) notify.error(error.message)
        }
      })
    }
  }
  const [needOpt, setNeedOpt] = createSignal(false)
  const ldapLoginEnabled = getSettingBool("ldap_login_enabled")
  const ldapLoginTips = getSetting("ldap_login_tips")
  if (ldapLoginEnabled) {
    setUseLdap(true)
  }

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
          <Image mr="$2" boxSize="$12" src={logo()} />
          <Heading color="$info9" fontSize="$2xl">
            {title()}
          </Heading>
        </Flex>
        <Show
          when={!needOpt()}
          fallback={
            <Input
              id="totp"
              name="otp"
              placeholder={t("login.otp-tips")}
              value={opt()}
              onInput={(e) => setOpt(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  Login()
                }
              }}
            />
          }
        >
          <Input
            name="username"
            placeholder={t("login.username-tips")}
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
          <Show when={!useauthn()}>
            <Input
              name="password"
              placeholder={t("login.password-tips")}
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  Login()
                }
              }}
            />
          </Show>
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
            <Text as="a" target="_blank" href={t("login.forget_url")}>
              {t("login.forget")}
            </Text>
          </Flex>
        </Show>
        <HStack w="$full" spacing="$2">
          <Show when={!useauthn()}>
            <Button
              colorScheme="primary"
              w="$full"
              onClick={() => {
                if (needOpt()) {
                  setOpt("")
                } else {
                  setUsername("")
                  setPassword("")
                }
              }}
            >
              {t("login.clear")}
            </Button>
          </Show>
          <Button w="$full" loading={loading()} onClick={Login}>
            {t("login.login")}
          </Button>
        </HStack>
        <Show when={ldapLoginEnabled}>
          <Checkbox
            w="$full"
            checked={useLdap() === true}
            onChange={() => setUseLdap(!useLdap())}
          >
            {ldapLoginTips}
          </Checkbox>
        </Show>
        <Button
          w="$full"
          colorScheme="accent"
          onClick={() => {
            changeToken()
            to(
              decodeURIComponent(searchParams.redirect || base_path || "/"),
              true,
            )
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
          <SwitchLanguageWhite />
          <SwitchColorMode />
          <SSOLogin />
          <Show when={AuthnSignEnabled}>
            <Icon
              cursor="pointer"
              boxSize="$8"
              as={IoFingerPrint}
              p="$0_5"
              onclick={AuthnSwitch}
            />
          </Show>
        </Flex>
      </VStack>
      <LoginBg />
    </Center>
  )
}

export default Login
