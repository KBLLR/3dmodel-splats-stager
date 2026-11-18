/**
 * Splat template viewer. Loads a record, fills the layout from its visible
 * fields, and swaps compositions, cinematic cameras, and effects.
 */
import "./style.css";
import { ViewerApp } from "@template/ViewerApp";

const app = new ViewerApp({
  canvas: document.querySelector("#webgl"),
  uiRoot: document.querySelector("#ui-root"),
  grade: document.querySelector("#grade"),
});

app.start().catch((error) => {
  console.error("Splat template failed to start", error);
  const root = document.querySelector("#ui-root");
  if (root) {
    root.textContent = "The template failed to start. See the console for details.";
  }
});
