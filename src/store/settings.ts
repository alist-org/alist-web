import { ext, recordToArray } from "~/utils";

const settings: Record<string, string> = {};

export const setSettings = (items: Record<string, string>) => {
  Object.keys(items).forEach((key) => {
    settings[key] = items[key];
  });
};

export const getSetting = (key: string) => settings[key] ?? "";
export const getSettingNumber = (key: string) =>
  parseInt(getSetting(key) === "" ? "0" : getSetting(key));
export const getIconColor = () => getSetting("main_color") || "#1890ff";

/**
 * like this:
{
  "ppt,pptx":{
    "example1":"https://example1.com/ppt?url=$url",
    "example2":"https://example2.com/ppt?url=$url"
  }
}
 */

type Previews = Record<string, Record<string, string>>;
let previews: Previews | undefined = undefined;

const getPreviews = (): Previews => {
  if (previews === undefined) {
    previews = JSON.parse(getSetting("external_previews"));
  }
  return previews!;
};

export const getPreviewsByName = (name: string) => {
  const extension = ext(name);
  for (const key in getPreviews()) {
    if (key.split(",").includes(extension)) {
      return recordToArray(getPreviews()[key]);
    }
  }
};
