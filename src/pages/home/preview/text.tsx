import axios from "axios";
import { createResource } from "solid-js";
import { Markdown, MaybeLoading } from "~/components";
import { useUrl } from "~/hooks";
import { objStore } from "~/store";
import { ObjType } from "~/types";
import { ext } from "~/utils";

export const fileType = {
  type: ObjType.TEXT,
  exts: [],
};

const Preview = () => {
  const { proxyUrl } = useUrl();
  const fetchContent = async () => {
    const resp = await axios.get(proxyUrl(objStore.obj, true), {
      responseType: "blob",
    });
    const res = await resp.data.text();
    if (!objStore.obj.name.endsWith(".md")) {
      return "```" + ext(objStore.obj.name) + "\n" + res + "\n```";
    }
    return res;
  };
  const [content] = createResource("", fetchContent);
  return (
    <MaybeLoading loading={content.loading}>
      <Markdown children={content()} />
    </MaybeLoading>
  );
};

export default Preview;
