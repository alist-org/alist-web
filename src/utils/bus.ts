import mitt from "mitt";

type Events = {
  to: string;
  gallery: string;
};

const bus = mitt<Events>();

export { bus };
