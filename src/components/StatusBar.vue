<template>
  <div class="container">
    <ul class="status">
      <li>Connected: {{ btText }}</li>
      <li>Power: {{ btPower }}</li>
      <li v-if="connected">
        <button class="button-link" @click="disconnect">Disconnect</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    msg: { type: String, default: "" },
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
    async disconnect() {
      try {
        await window.device.gatt.disconnect();
        this.$store.dispatch("bt/connect", false);
        this.$store.dispatch("bt/connectText", "disconnected");
        this.$store.dispatch("bt/power", "on");
        this.$store.dispatch("bt/reconnect", window.device.name);
        let event = new CustomEvent("bt-device", {
          detail: { device: undefined },
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Argh! " + error);
      }
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
