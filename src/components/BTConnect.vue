<template>
  <div class="container">
    <button v-if="!searching" class="button-link" @click="findBT">
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
    }),
  },
  methods: {
    async findBT() {
      try {
        this.searching = true;
        const device = await navigator.bluetooth.requestDevice({
          // filters: [...] <- Prefer filters to save energy & show relevant devices.
          acceptAllDevices: true,
        });
        await device.gatt.connect();

        this.$store.dispatch("bt/connect", true);
        this.$store.dispatch("bt/connectText", device.name);
      } catch (error) {
        console.error(error);
        this.$store.dispatch(
          "bt/power",
          "Error occured or possibly no BT Device found"
        );
        this.$store.dispatch("bt/connect", false);
        this.$store.dispatch("bt/connectText", "disconnected");
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
