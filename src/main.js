/**
 * @file Entry for the 3D Model Splats Stager.
 * The shell is the original Studio Labs page. ViewerApp fills it from splat records.
 */
import "./style.css";
import { ViewerApp } from "@template/ViewerApp";

const app = new ViewerApp({
  canvas: document.querySelector("#webgl"),
  grade: document.querySelector("#grade"),
  settingsButton: document.querySelector("[data-settings-toggle]"),
});

app.start().catch((error) => {
  console.error("Viewer failed to start", error);
  const intro = document.querySelector(".intro");
  if (intro) {
    intro.textContent = "The viewer failed to start. See the console for details.";
  }
});
