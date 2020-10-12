// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import bt from "@abandonware/noble";
import store from "./store/index";

bt.startScanning([], true);
bt.on("stateChange", (e) => {
  console.log(e);
});

bt.on("discover", async (peripheral) => {
  if (
    peripheral.advertisement.localName &&
    peripheral.advertisement.localName.includes("Triones")
  ) {
    try {
      await peripheral.connect();
      await bt.stopScanningAsync();
      peripheral.once("connect", async () => {
        store.dispatch("bt/set", true);
        peripheral.discoverAllServicesAndCharacteristics(
          (error, services, characteristics) => {
            // console.log(characteristics)
            characteristics.forEach((c) => {
              if (c.properties.includes("write")) {
                const b = Buffer.from([0xcc, 0x23, 0x33]);
                console.log(c);
                c.write(b, false, () => {
                  console.log("write");
                });
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
