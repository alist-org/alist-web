import {
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
} from "@hope-ui/solid";
import { createSignal, For, JSXElement, Show } from "solid-js";
import { useFetch, useManageTitle, useRouter, useT, useTitle } from "~/hooks";
import { setUser, user } from "~/store";
import { UserMethods, UserPermissions } from "~/types";
import { handleRresp, notify, r } from "~/utils";

const PermissionBadge = (props: { can: boolean; children: JSXElement }) => {
  return (
    <Badge colorScheme={props.can ? "success" : "danger"}>
      {props.children}
    </Badge>
  );
};

const Profile = () => {
  const t = useT();
  useManageTitle("manage.sidemenu.profile");
  const { to } = useRouter();
  const [username, setUsername] = createSignal(user().username);
  const [password, setPassword] = createSignal("");
  const [loading, save] = useFetch(() =>
    r.post("/me/update", {
      username: username(),
      password: password(),
    })
  );
  return (
    <VStack spacing="$2" alignItems="start">
      <Heading>{t("users.update_profile")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <FormControl>
          <FormLabel for="username">{t("users.change_username")}</FormLabel>
          <Input
            id="username"
            value={username()}
            onInput={(e) => {
              setUsername(e.currentTarget.value);
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
              setPassword(e.currentTarget.value);
            }}
          />
          <FormHelperText>{t("users.change_password_tips")}</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <HStack spacing="$2">
        <Button
          loading={loading()}
          onClick={async () => {
            const resp = await save();
            handleRresp(resp, () => {
              setUser({ ...user(), username: username() });
              notify.success(t("users.update_profile_success"));
              to(`/@login?redirect=${encodeURIComponent(location.pathname)}`);
            });
          }}
        >
          {t("global.save")}
        </Button>
        <Show when={!user().otp}>
          <Button colorScheme="accent" onClick={() => {
            to("/@manage/2fa")
          }}>
            {t("users.enable_2fa")}
          </Button>
        </Show>
      </HStack>
      <HStack wrap="wrap" gap="$2" mt="$2">
        <For each={UserPermissions}>
          {(item, i) => (
            <PermissionBadge can={UserMethods.can(user(), i())}>
              {t(`users.permissions.${item}`)}
            </PermissionBadge>
          )}
        </For>
      </HStack>
    </VStack>
  );
};

export default Profile;
