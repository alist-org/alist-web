import mitt from "mitt";

type Events = {
  to: string;
  gallery: string;
  click: string;
};

const bus = mitt<Events>();

export { bus };
