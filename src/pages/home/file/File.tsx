import { HStack, VStack } from "@hope-ui/solid";
import { createMemo, createSignal, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { SelectWrapper } from "~/components";
import { objStore } from "~/store";
import { CommonPreview } from "./common-preview";
import { OpenWith } from "./open-with";
import { getPreviews, previewRecord } from "./previews";

const File = () => {
  const previews = createMemo(() => {
    return getPreviews({ ...objStore.obj, provider: objStore.provider });
  });
  const [cur, setCur] = createSignal(previews()[0]);
  return (
    <Show when={previews().length > 1} fallback={<CommonPreview />}>
      <VStack w="$full" spacing="$2">
        <HStack w="$full" spacing="$2">
          <SelectWrapper
            alwaysShowBorder
            value={cur()}
            onChange={setCur}
            options={previews().map((item) => ({ value: item }))}
          />
          <OpenWith />
        </HStack>
        <Dynamic component={previewRecord[cur()]} />
      </VStack>
    </Show>
  );
};

export default File;
