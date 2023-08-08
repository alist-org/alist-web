import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  VStack,
  Text,
} from "@hope-ui/solid"
import { createSignal, For, JSXElement, onCleanup, Show } from "solid-js"
import { LinkWithBase } from "~/components"
import { useFetch, useManageTitle, useRouter, useT } from "~/hooks"
import { setMe, me, getSettingBool } from "~/store"
import { PEmptyResp, UserMethods, UserPermissions } from "~/types"
import { handleResp, notify, r } from "~/utils"

const PermissionBadge = (props: { can: boolean; children: JSXElement }) => {
  return (
    <Badge colorScheme={props.can ? "success" : "danger"}>
      {props.children}
    </Badge>
  )
}

const Profile = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.profile")
  const { to } = useRouter()
  const [username, setUsername] = createSignal(me().username)
  const [password, setPassword] = createSignal("")
  const [confirmPassword, setConfirmPassword] = createSignal("")
  const [loading, save] = useFetch(
    (ssoID?: boolean): PEmptyResp =>
      r.post("/me/update", {
        username: ssoID ? me().username : username(),
        password: ssoID ? "" : password(),
        sso_id: me().sso_id,
      }),
  )
  const saveMe = async (ssoID?: boolean) => {
    if (password() && password() !== confirmPassword()) {
      notify.warning(t("users.confirm_password_not_same"))
      return
    }
    const resp = await save(ssoID)
    handleResp(resp, () => {
      setMe({ ...me(), username: username() })
      if (!ssoID) {
        notify.success(t("users.update_profile_success"))
        to(`/@login?redirect=${encodeURIComponent(location.pathname)}`)
      } else {
        to("")
      }
    })
  }
  function messageEvent(event: MessageEvent) {
    const data = event.data
    if (data.sso_id) {
      setMe({ ...me(), sso_id: data.sso_id })
      saveMe(true)
    }
  }
  window.addEventListener("message", messageEvent)
  onCleanup(() => {
    window.removeEventListener("message", messageEvent)
  })
  return (
    <VStack w="$full" spacing="$4" alignItems="start">
      <Show
        when={!UserMethods.is_guest(me())}
        fallback={
          <>
            <Alert
              status="warning"
              flexDirection={{
                "@initial": "column",
                "@lg": "row",
              }}
            >
              <AlertIcon mr="$2_5" />
              <AlertTitle mr="$2_5">{t("users.guest-tips")}</AlertTitle>
              <AlertDescription>{t("users.modify_nothing")}</AlertDescription>
            </Alert>
            <HStack spacing="$2">
              <Text>{t("global.have_account")}</Text>
              <Text
                color="$info9"
                as={LinkWithBase}
                href={`/@login?redirect=${encodeURIComponent(
                  location.pathname,
                )}`}
              >
                {t("global.go_login")}
              </Text>
            </HStack>
          </>
        }
      >
        <Heading>{t("users.update_profile")}</Heading>
        <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
          <FormControl>
            <FormLabel for="username">{t("users.change_username")}</FormLabel>
            <Input
              id="username"
              value={username()}
              onInput={(e) => {
                setUsername(e.currentTarget.value)
              }}
            />
          </FormControl>
        </SimpleGrid>
        <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
          <FormControl>
            <FormLabel for="password">{t("users.change_password")}</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password()}
              onInput={(e) => {
                setPassword(e.currentTarget.value)
              }}
            />
            <FormHelperText>{t("users.change_password-tips")}</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel for="confirm-password">
              {t("users.confirm_password")}
            </FormLabel>
            <Input
              id="confirm-password"
              type="password"
              placeholder="********"
              value={confirmPassword()}
              onInput={(e) => {
                setConfirmPassword(e.currentTarget.value)
              }}
            />
            <FormHelperText>{t("users.confirm_password-tips")}</FormHelperText>
          </FormControl>
        </SimpleGrid>
        <HStack spacing="$2">
          <Button loading={loading()} onClick={[saveMe, false]}>
            {t("global.save")}
          </Button>
          <Show when={!me().otp}>
            <Button
              colorScheme="accent"
              onClick={() => {
                to("/@manage/2fa")
              }}
            >
              {t("users.enable_2fa")}
            </Button>
          </Show>
        </HStack>
      </Show>
      <Show
        when={
          getSettingBool("sso_login_enabled") && !UserMethods.is_guest(me())
        }
      >
        <Heading>{t("users.sso_login")}</Heading>
        <HStack spacing="$2">
          <Show
            when={me().sso_id}
            fallback={
              <Button
                onClick={() => {
                  const url = r.getUri() + "/auth/sso?method=get_sso_id"
                  const popup = window.open(
                    url,
                    "authPopup",
                    "width=500,height=600",
                  )
                }}
              >
                {t("users.connect_sso")}
              </Button>
            }
          >
            <Button
              colorScheme="danger"
              loading={loading()}
              onClick={() => {
                setMe({ ...me(), sso_id: "" })
                saveMe(true)
              }}
            >
              {t("users.disconnect_sso")}
            </Button>
          </Show>
        </HStack>
      </Show>
      <HStack wrap="wrap" gap="$2" mt="$2">
        <For each={UserPermissions}>
          {(item, i) => (
            <PermissionBadge can={UserMethods.can(me(), i())}>
              {t(`users.permissions.${item}`)}
            </PermissionBadge>
          )}
        </For>
      </HStack>
    </VStack>
  )
}

export default Profile
