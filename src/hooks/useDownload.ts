import axios from "axios";
import { local, selectedObjs } from "~/store";
import { notify } from "~/utils";
import { useSelectedLink, useLink, useT } from ".";

export const useDownload = () => {
  const { rawLinks } = useSelectedLink();
  const { rawLink } = useLink();
  const t = useT();
  return {
    batchDownloadSelected: () => {
      const urls = rawLinks(true);
      urls.forEach((url) => {
        window.open(url, "_blank");
      });
    },
    sendToAria2: async () => {
      const selectedFiles = selectedObjs().filter((obj) => !obj.is_dir);
      const { aria2RpcUrl, aria2RpcSecret } = local;
      if (!aria2RpcUrl) {
        notify.warning(t("home.toolbar.aria2_not_set"));
        return;
      }
      try {
        for (const file of selectedFiles) {
          const resp = await axios.post(aria2RpcUrl, {
            id: Math.random().toString(),
            jsonrpc: "2.0",
            method: "aria2.addUri",
            params: [
              "token:" + aria2RpcSecret ?? "",
              [rawLink(file)],
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
