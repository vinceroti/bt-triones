// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import bt from "@abandonware/noble";
import store from "./store/index";
import { ipcRenderer } from "electron";

window.addEventListener("startScan", async () => {
  await bt.startScanningAsync([], true);
  store.dispatch("bt/connectText", "starting...");
});

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

// bt.on("discover", async (peripheral) => {
//   if (store.getters["bt/connectText"] !== "Finding & Connecting...")
//     store.dispatch("bt/connectText", "scanning...");
//   let name = peripheral.advertisement.localName;
//   const arr = store.getters["bt/devicesFound"];
//   if (name && !arr.find((e) => e.id === peripheral.id)) {
//     arr.push({
//       id: peripheral.id,
//       name: peripheral.advertisement.localName,
//     });
//     store.dispatch("bt/devicesFound", arr);
//   }
//   const storeDevice = store.getters["bt/device"];
//   if (storeDevice && storeDevice.id && storeDevice.id === peripheral.id) {
//     try {
//       await bt.stopScanningAsync();
//       await peripheral.connect();
//       currentP = peripheral;
//       peripheral.once("connect", async () => {
//         store.dispatch("bt/connectText", name);
//         peripheral.discoverAllServicesAndCharacteristics(
//           (error, services, characteristics) => {
//             characteristics.forEach((c) => {
//               if (c.properties.includes("write")) {
//                 window.char = c;
//                 store.dispatch("bt/connect", true);
//               }
//             });
//           }
//         );
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   }
// });
