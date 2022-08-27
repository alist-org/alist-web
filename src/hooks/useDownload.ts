import axios from "axios";
import { local, selectedObjs } from "~/store";
import { notify } from "~/utils";
import { useSelectedUrl, useUrl, useT } from ".";

export const useDownload = () => {
  const { rawUrls } = useSelectedUrl();
  const { rawUrl } = useUrl();
  const t = useT();
  return {
    batchDownloadSelected: () => {
      const urls = rawUrls(true);
      urls.forEach((url) => {
        window.open(url, "_blank");
      });
    },
    sendToAria2: async () => {
      const selectedFiles = selectedObjs().filter((obj) => !obj.is_dir);
      const { rpcUrl, rpcSecret } = local;
      if (!rpcUrl) {
        notify.warning(t("home.toolbar.aria2_not_set"));
        return;
      }
      try {
        for (const file of selectedFiles) {
          const resp = await axios.post(rpcUrl, {
            id: Math.random().toString(),
            jsonrpc: "2.0",
            method: "aria2.addUri",
            params: [
              "token:" + rpcSecret ?? "",
              [rawUrl(file)],
              {
                out: file.name,
                "check-certificate": "false",
              },
            ],
          });
          console.log(resp);
        }
        notify.success(t("home.toolbar.send_aria2_success"));
      } catch (e) {
        notify.error(`failed to send to aria2: ${e}`);
      }
    },
  };
};
