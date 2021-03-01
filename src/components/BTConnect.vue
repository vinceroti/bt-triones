<template>
  <div class="container">
    <button v-if="!searching" class="button-link" @click="search">
      Search for BT Devices
    </button>
    <multiselect
      v-if="searching"
      v-model="dropdownValue"
      placeholder="Select Device"
      :options="devices"
      track-by="deviceName"
      label="deviceName"
      @input="input"
    ></multiselect>
    <button v-if="reconnect && !searching" class="button-link" @click="connect">
      Reconnect to: {{ reconnect }}
    </button>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { mapGetters } from "vuex";
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
  components: {
    Multiselect,
  },
  data() {
    return { searching: false, dropdownValue: null };
  },
  computed: {
    ...mapGetters({
      devices: "bt/devicesFound",
      connected: "bt/connected",
      reconnect: "bt/reconnect",
    }),
  },
  methods: {
    async search() {
      try {
        this.searching = true;
        window.device = await navigator.bluetooth.requestDevice({
          // filters: [...] <- Prefer filters to save energy & show relevant devices.
          // UUID for write, write no response
          optionalServices: [0xffd5],
          acceptAllDevices: true,
        });
        this.connect();
      } catch (e) {
        console.error(e);
        this.$store.dispatch(
          "bt/power",
          "Error occured or possibly no BT Device found"
        );
        this.searching = false;
      }
    },
    async connect() {
      try {
        const device = window.device;
        this.$store.dispatch("bt/connectText", "Connecting to GATT Server...");
        const server = await device.gatt.connect();

        // Note that we could also get all services that match a specific UUID by
        // passing it to getPrimaryServices().
        this.$store.dispatch("bt/connectText", "Getting Services...");
        const services = await server.getPrimaryServices();
        this.$store.dispatch("bt/connectText", "Getting Characteristics...");
        for (const service of services) {
          const characteristics = await service.getCharacteristics();
          characteristics.forEach(async (c) => {
            if (c.properties.writeWithoutResponse) {
              window.char = c;
              this.$store.dispatch("bt/connect", true);
              this.$store.dispatch("bt/connectText", device.name);
            }
          });
        }
      } catch (error) {
        console.error(error);
        this.$store.dispatch(
          "bt/power",
          "Error occured or possibly no BT Device found"
        );
        this.$store.dispatch("bt/connect", false);
        this.$store.dispatch("bt/connectText", "disconnected");
        this.$store.dispatch("bt/reconnect", false);
        this.searching = false;
      }
    },
    input(val) {
      this.$store.dispatch("bt/connect", false);
      if (val) {
        this.$store.dispatch("bt/connectText", "Finding & Connecting...");
        let event = new CustomEvent("bt-device", {
          detail: { device: val.deviceName },
        });
        window.dispatchEvent(event);
        this.$store.dispatch("bt/device", val);
      }
      if (!val) this.disconnect();
    },
    startScan() {
      let event = new Event("startScan");
      window.dispatchEvent(event);
    },
    disconnect() {
      this.$store.dispatch("bt/connect", false);
      this.dropdownValue = null;
      this.findBT();
    },
  },
};
</script>

<style lang="scss" scoped>
.button-link {
  display: block;
  margin: 0 auto;
}
</style>
