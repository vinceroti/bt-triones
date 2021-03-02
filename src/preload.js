// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import store from "./store/index";
import { ipcRenderer } from "electron";

window.addEventListener("bt-device", async (event) => {
  ipcRenderer.send("bt-device", event.detail.device);
});

ipcRenderer.on("perm", (event, message) => {
  store.dispatch("audio/micPermission", message);
});

ipcRenderer.on("deviceList", (event, deviceList) => {
  store.dispatch("bt/devicesFound", deviceList);
  store.dispatch("bt/connectText", "scanning...");
  store.dispatch("bt/power", "on");
});
