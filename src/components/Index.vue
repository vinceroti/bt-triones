<template>
  <div>
    <header>
      <status-bar />
    </header>
    <main v-if="btConnected">
      <button class="button-primary" @click="click(0x23)" ref="button">
        Turn On
      </button>
      <button class="button-primary" @click="click(0x24)" ref="button">
        Turn Off
      </button>
      <multiselect v-model="value" :options="options"></multiselect>
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
      options: ["list", "of", "options"],
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
      const b = Buffer.from([0xcc, code, 0x33]);
      char.write(b, false);
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
}
</style>
