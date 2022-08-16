import { Portal } from "solid-js/web";
import { Center } from "./Center";
import { Right } from "./Right";

export const Toolbar = () => {
  return (
    <Portal>
      <Right />
      <Center />
    </Portal>
  );
};
