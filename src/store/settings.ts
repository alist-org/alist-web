import { Resp } from "~/pages/types/resp";
import { r } from "~/utils/request";
const settings: Record<string, string> = {};

const initSettings = async () => {
  const resp: Resp<Record<string, string>> = (await r.get("/public/settings")).data;
  if (resp.code === 200) {
    Object.keys(resp.data).forEach((key) => {
      settings[key] = resp.data[key];
    });
  }
};

export const getSetting = (key: string) => settings[key];
