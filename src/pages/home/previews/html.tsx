import { hope } from "@hope-ui/solid";
import { MaybeLoading } from "~/components";
import { useFetchText } from "~/hooks";

const HtmlPreview = () => {
  const [content] = useFetchText();
  return (
    <MaybeLoading loading={content.loading}>
      <hope.iframe
        w="$full"
        minH="70vh"
        rounded="$lg"
        shadow="$md"
        srcdoc={content()}
      />
    </MaybeLoading>
  );
};

export default HtmlPreview;