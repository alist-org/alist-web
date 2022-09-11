import { Box } from "@hope-ui/solid";
import { MaybeLoading } from "~/components";
import { useFetch, useRouter } from "~/hooks";
import { password } from "~/store";
import { Resp } from "~/types";
import { handleRresp, r } from "~/utils";

const AliDocPreview = () => {
  const { pathname } = useRouter();
  const [loading, post] = useFetch(
    (): Promise<Resp<{ access_token: string; preview_url: string }>> =>
      r.post("/fs/other", {
        path: pathname(),
        password: password(),
        method: "doc_preview"
      })
  );
  const init = async () => {
    const resp = await post();
    handleRresp(resp, (data) => {
      const docOptions = aliyun.config({
        mount: document.querySelector("#office-preview")!,
        url: data.preview_url,
      });
      docOptions.setToken({ token: data.access_token });
    });
  };
  init();
  return (
    <MaybeLoading loading={loading()}>
      <Box w="$full" h="70vh" id="office-preview"></Box>
    </MaybeLoading>
  );
};

export default AliDocPreview;
