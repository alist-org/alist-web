export const firstUpperCase = (str: string) => {
  if (!str || str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const trimLeft = (str: string, sub: string) => {
  return str.startsWith(sub) ? str.slice(sub.length) : str;
};

export function getFileSize(size: number) {
  if (!size) return "-";

  const num = 1024.0; //byte

  if (size < num) return size + "B";
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "K"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}

const full = (p: number) => {
  return p < 10 ? "0" + p : p;
};

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const mon = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return (
    year +
    "-" +
    full(mon) +
    "-" +
    full(day) +
    " " +
    full(hour) +
    ":" +
    full(min) +
    ":" +
    full(sec)
  );
}

export const convertURL = (scheme: string, url: string, name: string) => {
  let ans = scheme;
  ans = ans.replace("$name", name);
  ans = ans.replace("$url", url);
  ans = ans.replace("$e_url", encodeURIComponent(url));
  ans = ans.replace("$b_url", window.btoa(url));
  ans = ans.replace("$eb_url", encodeURIComponent(window.btoa(url)));
  return ans;
};

export const strToRegExp = (str: string) => {
  str = str.trim();
  let pattern = str.replace(/^\/(.*)\/([a-z]*)$/, "$1");
  let args = str.replace(/^\/(.*)\/([a-z]*)$/, "$2");
  const reg = new RegExp(pattern, args);
  return reg;
};
