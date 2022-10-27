import { Button, Heading, Image, Input, VStack } from "@hope-ui/solid";
import { createSignal, Show } from "solid-js";
import { MaybeLoading } from "~/components";
import { useRouter, useFetch, useT } from "~/hooks";
import { setUser, user } from "~/store";
import { Resp } from "~/types";
import { handleResp, handleRespWithNotifySuccess, notify, r } from "~/utils";

interface Generate2FA {
  qr: string;
  secret: string;
}

const TwoFA = () => {
  const { back } = useRouter();
  const [generateLoading, generate] = useFetch(() =>
    r.post("/auth/2fa/generate")
  );
  const t = useT();
  const [otpData, setOtpData] = createSignal<Generate2FA>();
  const init = async () => {
    if (user().otp) {
      notify.warning(t("users.2fa_already_enabled"));
      back();
      return;
    }
    const resp: Resp<Generate2FA> = await generate();
    handleResp(resp, setOtpData);
  };
  const [code, setCode] = createSignal("");
  init();
  const [verifyLoadind, verify] = useFetch(() =>
    r.post("/auth/2fa/verify", {
      code: code(),
      secret: otpData()?.secret,
    })
  );
  const verify2FA = async () => {
    const resp = await verify();
    handleRespWithNotifySuccess(resp, () => {
      setUser({ ...user(), otp: true });
      back();
    });
  };
  return (
    <MaybeLoading loading={generateLoading()}>
      <Show when={otpData()}>
        <VStack spacing="$2" alignItems="start">
          <Heading>{t("users.scan_qr")}</Heading>
          <Image boxSize="$xs" rounded="$lg" src={otpData()?.qr} />
          <Input
            maxW="$xs"
            placeholder={t("users.input_code")}
            value={code()}
            onInput={(e) => setCode(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                verify2FA();
              }
            }}
          />
          <Button loading={verifyLoadind()} onClick={verify2FA}>
            {t("users.verify")}
          </Button>
        </VStack>
      </Show>
    </MaybeLoading>
  );
};

export default TwoFA;
