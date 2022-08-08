const settings: Record<string, string> = {};

export const setSettings = (items: Record<string, string>) => {
  Object.keys(items).forEach((key) => {
    settings[key] = items[key];
  });
};

export const getSetting = (key: string) => settings[key] ?? "";
export const getSettingNumber = (key: string) =>
  parseInt(getSetting(key) === "" ? "0" : getSetting(key));
export const getIconColor = () => getSetting("icon_color") || "#1890ff";
