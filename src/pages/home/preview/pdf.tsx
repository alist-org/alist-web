import { createMemo, createSignal } from "solid-js";
import { BoxWithFullScreen, SelectWrapper } from "~/components";
import { getSetting, objStore } from "~/store";
import { hope, HStack, VStack } from "@hope-ui/solid";
import { convertURL, recordToArray } from "~/utils";
import { ExternalPreview } from "../file/ExternalPreview";

export const fileType = {
  type: -1,
  exts: ["pdf"],
};

const PdfPreview = () => {
  const previews = createMemo(() => {
    let _previews = {};
    try {
      _previews = JSON.parse(getSetting("pdf_viewers"));
    } catch (e) {
      _previews = {
        "pdf.js":
          "https://alist-org.github.io/pdf.js/web/viewer.html?file=$url",
      };
    }
    return recordToArray(_previews);
  });
  const [cur, setCur] = createSignal(previews()[0].key);
  return (
    <VStack spacing="$2" w="$full">
      <HStack w="$full" spacing="$2">
        <SelectWrapper
          value={cur()}
          onChange={setCur}
          options={previews().map((preview) => ({
            value: preview.key,
            label: preview.key,
          }))}
        />
        <ExternalPreview />
      </HStack>
      <BoxWithFullScreen w="$full" h="70vh">
        <hope.iframe
          w="$full"
          h="$full"
          src={convertURL(
            previews().find((p) => p.key === cur())!.value,
            objStore.raw_url,
            objStore.obj.name
          )}
        />
      </BoxWithFullScreen>
    </VStack>
  );
};

export default PdfPreview;
