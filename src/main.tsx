/* @refresh reload */
import { Router } from "solid-app-router";
import { render } from "solid-js/web";

import App from "./App";

declare global {
  interface Window {
    [key: string]: any;
  }
}
render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
