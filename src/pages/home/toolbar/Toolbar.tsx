import { Portal } from "solid-js/web";
import { Center } from "./Center";
import { Right } from "./Right";
import { Copy, Move } from "./CopyMove";
import { Delete } from "./Delete";
import { Rename } from "./Rename";
import { NewFile } from "./NewFile";
import { Mkdir } from "./Mkdir";
import { Aria2 } from "./Aria2";
import { PackageDownloadModal } from "./Download";

export const Modal = () => {
  return (
    <>
      <Copy />
      <Move />
      <Rename />
      <Delete />
      <NewFile />
      <Mkdir />
      <Aria2 />
      <PackageDownloadModal />
    </>
  );
};

export const Toolbar = () => {
  return (
    <Portal>
      <Right />
      <Center />
      <Modal />
    </Portal>
  );
};
