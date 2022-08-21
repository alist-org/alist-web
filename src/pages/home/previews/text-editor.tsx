import { Button, useColorMode, VStack } from "@hope-ui/solid";
import { createMemo } from "solid-js";
import { MaybeLoading } from "~/components";
import { MonacoEditorLoader } from "~/components/MonacoEditor";
import { useFetchText, useT } from "~/hooks";
import { objStore } from "~/store";

export const fileType = {
  type: -1,
  exts: [],
};

const TextEditor = () => {
  const [content] = useFetchText();
  const { colorMode } = useColorMode();
  const theme = createMemo(() => {
    return colorMode() === "light" ? "vs" : "vs-dark";
  });
  const t = useT();
  return (
    <MaybeLoading loading={content.loading}>
      <VStack w="$full" alignItems="start" spacing="$2">
        <MonacoEditorLoader
          value={content()}
          theme={theme()}
          path={objStore.obj.name}
          onChange={(value) => {
            console.log(value);
          }}
        />
        <Button>{t("global.save")}</Button>
      </VStack>
    </MaybeLoading>
  );
};

export default TextEditor;
