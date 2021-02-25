// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import bt from "@abandonware/noble";
import store from "./store/index";
import { ipcRenderer } from "electron";

window.addEventListener("DOMContentLoaded", async () => {
  bt.on("stateChange", async (state) => {
    if (state === "poweredOn") {
      await bt.startScanningAsync([], true);
      store.dispatch("bt/power", "on");
      store.dispatch("bt/connectText", "starting...");
    } else {
      window.char = undefined;
      store.dispatch("bt/power", "off");
      store.dispatch("bt/connect", false);
      store.dispatch("bt/deviceId", null);
      store.dispatch("bt/connectText", "disconnected");
    }
  });
});

ipcRenderer.on("perm", (event, message) => {
  store.dispatch("audio/micPermission", message);
});

bt.on("discover", async (peripheral) => {
  store.dispatch("bt/connectText", "scanning...");
  let name = peripheral.advertisement.localName;
  if (name && name.includes("Triones")) {
    try {
      const connect = await peripheral.connect();
      console.log(connect);
      await bt.stopScanningAsync();
      peripheral.once("connect", async () => {
        store.dispatch("bt/connectText", name);
        store.dispatch("bt/deviceId", peripheral.id);
        peripheral.discoverAllServicesAndCharacteristics(
          (error, services, characteristics) => {
            characteristics.forEach((c) => {
              if (c.properties.includes("write")) {
                console.log(c);
                window.char = c;
                store.dispatch("bt/connect", true);
              }
            });
          }
        );
      });
    } catch (e) {
      console.error(e);
    }
  }
});
