// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
var bt = require('@abandonware/noble');

bt.startScanning([], true);
bt.on("stateChange", (e) => {
  console.log(e);
});

bt.on("discover", async (peripheral) => {
  if (peripheral.advertisement.localName && peripheral.advertisement.localName.includes("Triones")) {
    console.log('found triones');
    await peripheral.connect();
    await bt.stopScanningAsync();
    peripheral.once("connect", async () => {
      peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
        // console.log(characteristics)
        characteristics.forEach(c => {
          if (c.properties.includes("write")) {
            const b = Buffer.from([0xCC, 0x23, 0x33]);
            console.log(c)
            c.write(b, false, (e) => {
              console.log('write')
            })
          }

        })
      });
    });
  }
});


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
