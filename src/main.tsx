/* @refresh reload */
import { Router } from "solid-app-router";
import { render } from "solid-js/web";

import { Boundary } from "./app/Boundary";

declare global {
  interface Window {
    [key: string]: any;
  }
}
render(
  () => (
    <Router>
      <Boundary />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
