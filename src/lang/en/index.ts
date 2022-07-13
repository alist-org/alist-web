const jsons = import.meta.glob("./*.json");
const langs: any = {};
for (const path in jsons) {
  const name = path.split("/")[1].split(".")[0];
  langs[name] = (await jsons[path]()).default;
}
export default langs;