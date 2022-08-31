import { Button, useColorMode, VStack } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { MaybeLoading } from "~/components";
import { MonacoEditorLoader } from "~/components/MonacoEditor";
import { useFetch, useFetchText, useRouter, useT } from "~/hooks";
import { objStore } from "~/store";
import { handleRresp, notify, r } from "~/utils";

const TextEditor = () => {
  const [content] = useFetchText();
  const { colorMode } = useColorMode();
  const theme = createMemo(() => {
    return colorMode() === "light" ? "vs" : "vs-dark";
  });
  const { pathname } = useRouter();
  const [value, setValue] = createSignal(content()?.content);
  const t = useT();
  const [loading, save] = useFetch(() =>
    r.put("/fs/put", value(), {
      headers: {
        "File-Path": encodeURIComponent(pathname()),
        "Content-Type": content()?.contentType || "text/plain",
      },
    })
  );
  return (
    <MaybeLoading loading={content.loading}>
      <VStack w="$full" alignItems="start" spacing="$2">
        <MonacoEditorLoader
          value={content()?.content}
          theme={theme()}
          path={objStore.obj.name}
          onChange={(value) => {
            setValue(value);
          }}
        />
        <Button
          loading={loading()}
          onClick={async () => {
            if (!value()) {
              notify.success(t("global.save_success"));
              return;
            }
            const resp = await save();
            handleRresp(resp, () => {
              notify.success(t("global.save_success"));
            });
          }}
        >
          {t("global.save")}
        </Button>
      </VStack>
    </MaybeLoading>
  );
};

export default TextEditor;
