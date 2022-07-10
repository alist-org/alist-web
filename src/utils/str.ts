export const firstUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const trimLeft = (str: string, sub: string) => {
  return str.startsWith(sub) ? str.slice(sub.length) : str;
};
