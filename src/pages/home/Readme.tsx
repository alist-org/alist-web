import { Box, useColorModeValue } from "@hope-ui/solid";
import { createMemo, Show, createResource, on } from "solid-js";
import { Markdown, MaybeLoading } from "~/components";
import { useUrl } from "~/hooks";
import { objStore, State } from "~/store";
import { fetchText } from "~/utils";

export const Readme = () => {
  const cardBg = useColorModeValue("white", "$neutral3");
  const { proxyUrl } = useUrl();
  const readme = createMemo(
    on(
      () => objStore.state,
      () => {
        if (
          ![State.FetchingMore, State.Folder, State.File].includes(
            objStore.state
          )
        ) {
          return "";
        }
        if (objStore.readme) {
          return objStore.readme;
        }
        if ([State.FetchingMore, State.Folder].includes(objStore.state)) {
          const obj = objStore.objs.find(
            (item) => item.name.toLowerCase() === "readme.md"
          );
          if (obj) {
            return proxyUrl(obj, true);
          }
        }
        return "";
      }
    )
  );
  const fetchContent = async (readme: string) => {
    if (/https?:\/\//g.test(readme)) {
      return await fetchText(readme);
    }
    return readme;
  };
  const [content] = createResource(readme, fetchContent);
  return (
    <Show when={readme()}>
      <Box w="$full" rounded="$xl" p="$4" bgColor={cardBg()}>
        <MaybeLoading loading={content.loading}>
          <Markdown children={content()} />
        </MaybeLoading>
      </Box>
    </Show>
  );
};
