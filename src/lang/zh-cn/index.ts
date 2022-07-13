const jsons = import.meta.globEager("./*.json");
const langs: any = {};
for (const path in jsons) {
  const name = path.split("/")[1].split(".")[0];
  langs[name] = jsons[path].default;
}
export default langs;
