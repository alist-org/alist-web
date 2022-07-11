const getTarget = (proxy: any) => {
  return JSON.parse(JSON.stringify(proxy));
};

export { getTarget };
