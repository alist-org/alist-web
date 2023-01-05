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
import { createSignal, For, JSXElement, Show } from "solid-js"
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
  const { to, searchParams } = useRouter()
  const [username, setUsername] = createSignal(me().username)
  const [password, setPassword] = createSignal("")
  const [loading, save] = useFetch(
    (githubID?: boolean): PEmptyResp =>
      r.post("/me/update", {
        username: githubID ? me().username : username(),
        password: githubID ? "" : password(),
        github_id: me().github_id,
      })
  )
  const saveMe = async (githubID?: boolean) => {
    const resp = await save(githubID)
    handleResp(resp, () => {
      setMe({ ...me(), username: username() })
      if (!githubID) {
        notify.success(t("users.update_profile_success"))
        to(`/@login?redirect=${encodeURIComponent(location.pathname)}`)
      } else {
        to("")
      }
    })
  }
  const githubID = searchParams["githubID"]
  if (githubID) {
    setMe({ ...me(), github_id: Number(githubID) })
    saveMe(true)
  }
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
                  location.pathname
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
          getSettingBool("github_login_enabled") && !UserMethods.is_guest(me())
        }
      >
        <Heading>{t("users.github_login")}</Heading>
        <HStack spacing="$2">
          <Show
            when={me().github_id}
            fallback={
              <Button
                onClick={() => {
                  window.location.href =
                    r.getUri() +
                    "/auth/github?callback_url=" +
                    window.location.href +
                    "&method=get_github_id"
                }}
              >
                {t("users.connect_github")}
              </Button>
            }
          >
            <Button
              colorScheme="danger"
              loading={loading()}
              onClick={() => {
                setMe({ ...me(), github_id: 0 })
                saveMe(true)
              }}
            >
              {t("users.disconnect_github")}
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
