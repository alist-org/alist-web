import {
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
import { createSignal } from "solid-js";
import { useFetch, useRouter, useT } from "~/hooks";
import { setUser, user } from "~/store";
import { handleRresp, notify, r } from "~/utils";

const Profile = () => {
  const t = useT();
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
      <Heading>{t("settings.update_profile")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <FormControl>
          <FormLabel for="username">{t("settings.change_username")}</FormLabel>
          <Input
            id="username"
            value={username()}
            onInput={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel for="password">{t("settings.change_password")}</FormLabel>
          <Input
            id="password"
            type="password"
            value={password()}
            onInput={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
          <FormHelperText>{t("settings.change_password_tips")}</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <Button
        loading={loading()}
        onClick={async () => {
          const resp = await save();
          handleRresp(resp, () => {
            setUser({ ...user(), username: username() });
            notify.success(t("settings.update_profile_success"));
            to(`/@login?redirect=${encodeURIComponent(location.pathname)}`);
          });
        }}
      >
        {t("global.save")}
      </Button>
    </VStack>
  );
};

export default Profile;
