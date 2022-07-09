import mitt from "mitt";

type Events = {
  to: string;
};

const bus = mitt<Events>();

export { bus };
