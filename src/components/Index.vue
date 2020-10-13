<template>
  <div class="container">
    <header>
      <status-bar />
    </header>
    <main v-if="btConnected">
      <div class="on-off">
        <button class="button-primary" @click="click(0x23)" ref="button">
          Turn On
        </button>
        <button class="button-primary" @click="click(0x24)" ref="button">
          Turn Off
        </button>
      </div>
      <multiselect
        placeholder="Mode Selection"
        v-model="value"
        :options="options"
      ></multiselect>
    </main>
    <footer></footer>
  </div>
</template>

<script>
import StatusBar from "./StatusBar.vue";
import { mapGetters } from "vuex";
import bt from "@abandonware/noble";
import Multiselect from "vue-multiselect";

let char;

export default {
  data() {
    return {
      value: null,
      options: [
        { code: 0x25, name: "Seven color cross fade" },
        { code: 0x26, name: "Red gradual change" },
        { code: 0x27, name: "Green gradual change" },
        { code: 0x28, name: "Blue gradual change" },
        { code: 0x29, name: "Yellow gradual change" },
        { code: 0x2a, name: "Cyan gradual change" },
        { code: 0x2b, name: "Purple gradual change" },
        { code: 0x2c, name: "White gradual change" },
        { code: 0x2d, name: "Red Green cross fade" },
        { code: 0x2e, name: "Red blue cross fade" },
        { code: 0x2f, name: "Green blue cross fade" },
        { code: 0x30, name: "Seven color stobe flash" },
        { code: 0x31, name: "Red strobe flash" },
        { code: 0x32, name: "Green strobe flash" },
        { code: 0x33, name: "Blue strobe flash" },
        { code: 0x34, name: "Yellow strobe flash" },
        { code: 0x35, name: "Cyan strobe flash" },
        { code: 0x36, name: "Purple strobe flash" },
        { code: 0x37, name: "White strobe flash" },
        { code: 0x38, name: "Seven color jumping change" },
      ],
    };
  },
  computed: {
    ...mapGetters({ btConnected: "bt/connected", deviceId: "bt/deviceId" }),
  },
  watch: {
    deviceId() {
      if (this.deviceId) {
        const peripheral = bt._peripherals[this.deviceId];
        peripheral.discoverAllServicesAndCharacteristics(
          (error, services, characteristics) => {
            characteristics.forEach((c) => {
              if (c.properties.includes("write")) char = c;
            });
          }
        );
      }
    },
  },
  components: {
    StatusBar,
    Multiselect,
  },
  methods: {
    click(code) {
      if (char && this.value) {
        const b = Buffer.from([0xcc, code, 0x33]);
        char.write(b, false);
      }
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
.on-off {
  display: flex;
  justify-content: center;
  margin-bottom: spacing(paragraph);
  button {
    margin: spacing(element);
  }
}
</style>
