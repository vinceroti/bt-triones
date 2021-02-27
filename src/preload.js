// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import bt from "@abandonware/noble";
import store from "./store/index";
import { ipcRenderer } from "electron";
let currentP = null;

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

window.addEventListener("startScan", async () => {
  if (currentP) await currentP.disconnect();
  await bt.startScanningAsync([], true);
  store.dispatch("bt/connectText", "starting...");
});

ipcRenderer.on("perm", (event, message) => {
  store.dispatch("audio/micPermission", message);
});

bt.on("discover", async (peripheral) => {
  if (store.getters["bt/connectText"] !== "Finding & Connecting...")
    store.dispatch("bt/connectText", "scanning...");
  let name = peripheral.advertisement.localName;
  const arr = store.getters["bt/devicesFound"];
  if (name && !arr.find((e) => e.id === peripheral.id)) {
    arr.push({
      id: peripheral.id,
      name: peripheral.advertisement.localName,
    });
    store.dispatch("bt/devicesFound", arr);
  }
  console.log(name);
  const storeDevice = store.getters["bt/device"];
  if (storeDevice && storeDevice.id && storeDevice.id === peripheral.id) {
    try {
      await bt.stopScanningAsync();
      await peripheral.connect();
      currentP = peripheral;
      peripheral.once("connect", async () => {
        store.dispatch("bt/connectText", name);
        peripheral.discoverAllServicesAndCharacteristics(
          (error, services, characteristics) => {
            characteristics.forEach((c) => {
              if (c.properties.includes("write")) {
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
