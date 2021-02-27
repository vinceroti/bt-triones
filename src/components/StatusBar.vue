<template>
  <div class="container">
    <ul class="status">
      <li>Connected: {{ btText }}</li>
      <li>Power: {{ btPower }}</li>
      <li v-if="connected">
        <button class="button-link" @click="disconnect">Disconnect</button>
      </li>
    </ul>
    <multiselect
      v-if="!connected"
      v-model="dropdownValue"
      placeholder="Select Device"
      :options="devices"
      track-by="name"
      label="name"
      @input="input"
    ></multiselect>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { mapGetters } from "vuex";

export default {
  components: {
    Multiselect,
  },
  props: {
    msg: { type: String, default: "" },
  },
  data() {
    return {
      dropdownValue: null,
    };
  },
  computed: {
    ...mapGetters({
      btText: "bt/connectText",
      btPower: "bt/power",
      devices: "bt/devicesFound",
      device: "bt/device",
      connected: "bt/connected",
    }),
  },
  methods: {
    input(val) {
      this.$store.dispatch("bt/connect", false);
      if (val) {
        this.$store.dispatch("bt/connectText", "Finding & Connecting...");
        let event = new Event("reconnectBT");
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
      this.$store.dispatch("bt/device", null);
      this.$store.dispatch("bt/devicesFound", []);
      this.startScan();
    },
  },
};
</script>
<style lang="scss" scoped>
.status {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
  li {
    margin: spacing(element) 0;
    &::after {
      content: "";
      margin: 0 5px;
      border-right: 1px solid;
    }
    &:last-child {
      &::after {
        border: 0;
        margin: 0;
      }
    }
  }
}
</style>
