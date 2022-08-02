const jsons = import.meta.glob("./*.json", { eager: true, import: "default" });
const langs: any = {};
for (const path in jsons) {
  const name = path.split("/")[1].split(".")[0];
  langs[name] = jsons[path];
}
export default langs;
