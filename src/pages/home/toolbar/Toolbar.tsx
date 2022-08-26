import { Portal } from "solid-js/web";
import { Center } from "./Center";
import { Right } from "./Right";
import { Copy, Move } from "./CopyMove";
import { Delete } from "./Delete";
import { Rename } from "./Rename";
import { NewFile } from "./NewFile";
import { Mkdir } from "./Mkdir";

export const Modal = () => {
  return (
    <>
      <Copy />
      <Move />
      <Rename />
      <Delete />
      <NewFile />
      <Mkdir />
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
