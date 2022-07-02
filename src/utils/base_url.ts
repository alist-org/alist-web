let api = import.meta.env.VITE_SERVER_URL as string;
if (window.ALIST.api) {
  api = window.ALIST.api;
}
if (api.endsWith("/")) {
  api = api.slice(0, -1);
}

export { api };
