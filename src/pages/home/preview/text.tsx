import {
  HStack,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectTrigger,
  SelectValue,
  VStack,
} from "@hope-ui/solid";
import { createMemo, createSignal, For, lazy, Match, Switch } from "solid-js";
import { Markdown, MaybeLoading } from "~/components";
import { useFetchText } from "~/hooks";
import { objStore } from "~/store";
import { ObjType } from "~/types";
import { ext } from "~/utils";
import { ExternalPreview } from "../file/ExternalPreview";

const TextEditor = lazy(() => import("./text-editor"));
const HtmlPreview = lazy(() => import("./html"));

export const fileType = {
  type: ObjType.TEXT,
  exts: [],
};

const MdPreview = () => {
  const [content] = useFetchText();
  const convertToMd = (content: string) => {
    if (!objStore.obj.name.endsWith(".md")) {
      return "```" + ext(objStore.obj.name) + "\n" + content + "\n```";
    }
    return content;
  };
  return (
    <MaybeLoading loading={content.loading}>
      <Markdown children={convertToMd(content())} />
    </MaybeLoading>
  );
};

const Preview = () => {
  const [viewer, setViewer] = createSignal("md");
  const viewers = createMemo(() => {
    const res = ["md", "editor"];
    objStore.obj.name.endsWith(".html") && res.push("html");
    return res;
  });
  return (
    <VStack w="$full" spacing="$2" alignItems="start">
      <HStack w="$full" spacing="$2">
        <Select value={viewer()} onChange={setViewer}>
          <SelectTrigger>
            <SelectValue />
            <SelectIcon />
          </SelectTrigger>
          <SelectContent>
            <SelectListbox>
              <For each={viewers()}>
                {(item) => (
                  <SelectOption value={item}>
                    <SelectOptionText>{item}</SelectOptionText>
                    <SelectOptionIndicator />
                  </SelectOption>
                )}
              </For>
            </SelectListbox>
          </SelectContent>
        </Select>
        <ExternalPreview />
      </HStack>
      <Switch>
        <Match when={viewer() === "md"}>
          <MdPreview />
        </Match>
        <Match when={viewer() === "editor"}>
          <TextEditor />
        </Match>
        <Match when={viewer() === "html"}>
          <HtmlPreview />
        </Match>
      </Switch>
    </VStack>
  );
};

export default Preview;
