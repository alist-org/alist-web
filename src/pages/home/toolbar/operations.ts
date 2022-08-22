import { IconTypes } from "solid-icons";
import { AiOutlineDelete } from "solid-icons/ai";
import { CgFileAdd, CgFolderAdd, CgRename } from "solid-icons/cg";
import { OcFilemoved2 } from "solid-icons/oc";
import { TbCopy, TbLink } from "solid-icons/tb";

interface Operations {
  [key: string]: {
    icon: IconTypes;
    color?: string;
    p?: boolean;
  };
}
export const operations: Operations = {
  rename: { icon: CgRename, color: "$accent9" },
  copy: { icon: TbCopy, color: "$success9" },
  move: { icon: OcFilemoved2, p: true, color: "$success9" },
  delete: { icon: AiOutlineDelete, color: "$danger9" },
  copy_url: { icon: TbLink, color: "$info9" },
  mkdir: { icon: CgFolderAdd, p: true },
  new_file: { icon: CgFileAdd, p: true },
};
// interface Operation {
//   label: string;
//   icon: IconTypes;
//   color?: string;
// }
// const operations: Operation[] = [
//   { label: "rename", icon: CgRename },
//   { label: "move", icon: OcFilemoved2 },
//   { label: "copy", icon: TbCopy },
//   { label: "delete", icon: AiOutlineDelete },
//   { label: "copy_url", icon: FiLink },
//   { label: "new_file", icon: CgFileAdd },
//   { label: "mkdir", icon: CgFolderAdd },
// ];
