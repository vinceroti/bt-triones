// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import bt from "@abandonware/noble";
import store from "./store/index";

window.addEventListener("DOMContentLoaded", () => {
  bt.on("stateChange", async (state) => {
    if (state === "poweredOn") {
      await bt.startScanningAsync([], true);
      store.dispatch("bt/power", "on");
    }
  });
});

bt.on("discover", async (peripheral) => {
  store.dispatch("bt/connectText", "scanning...");
  let name = peripheral.advertisement.localName;
  if (name && name.includes("Triones")) {
    try {
      await peripheral.connect();
      await bt.stopScanningAsync();
      peripheral.once("connect", async () => {
        store.dispatch("bt/connectText", name);
        store.dispatch("bt/connect", true);
        store.dispatch("bt/deviceId", peripheral.id);
      });
    } catch (e) {
      console.error(e);
    }
  }
});
