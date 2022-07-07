import { createSignal } from "solid-js";
import { Obj } from "~/types/obj";

const [obj, setObj] = createSignal<Obj>();

const [objs, setObjs] = createSignal<Obj[]>();

export { obj, setObj, objs, setObjs };
