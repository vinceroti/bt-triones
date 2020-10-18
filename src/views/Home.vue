<template>
  <div>
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
      v-model="dropdownValue"
      :options="dropDownOptions"
      track-by="name"
      label="name"
      @select="select"
    ></multiselect>
    <vue-slider @change="slide" v-model="sliderValue" />
    <chrome-picker
      v-model="colorPicker"
      @input="inputColor"
      class="custom-styling-picker"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import bt from "@abandonware/noble";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import converter from "hex2dec";
import { Chrome } from "vue-color";
import debounce from "lodash/debounce";

let char;

export default {
  components: {
    Multiselect,
    "chrome-picker": Chrome,
  },
  data() {
    return {
      speed: 25,
      sliderValue: 0,
      dropdownValue: null,
      dropDownOptions: [
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
      colorPicker: 0,
    };
  },
  computed: {
    ...mapGetters({ deviceId: "bt/deviceId" }),
  },
  watch: {
    deviceId() {
      this.findChar();
    },
  },
  mounted() {
    this.findChar();
  },
  beforeUnmount() {
    char = null;
  },
  methods: {
    findChar() {
      if (this.deviceId && !char) {
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
    select(e) {
      if (char) {
        const buff = Buffer.from([0xbb, e.code, this.speed, 0x44]);
        char.write(buff, true, this.callback);
      }
    },
    click(code) {
      if (char) {
        const buff = Buffer.from([0xcc, code, 0x33]);
        char.write(buff, true, this.callback);
      }
    },
    slide(e) {
      // const dec = Math.round((e / 100) * 255);
      this.speed = converter.decToHex(Math.abs(e - 100).toString());
      if (this.dropdownValue) this.select(this.dropdownValue);
    },
    inputColor: debounce(function (e) {
      if (char) {
        const r = converter.decToHex(e.rgba.r.toString());
        const g = converter.decToHex(e.rgba.g.toString());
        const b = converter.decToHex(e.rgba.b.toString());
        const buff = Buffer.from([0x56, r, g, b, 0x00, 0xf0, 0xaa]);
        char.write(buff, true, this.callback);
      }
    }, 25),
    callback(e) {
      console.error(e);
    },
  },
};
</script>
<style lang="scss" scoped>
.on-off {
  display: flex;
  justify-content: center;
  margin-bottom: spacing(paragraph);
  button {
    margin: spacing(element);
  }
}
.vue-slider {
  margin-bottom: spacing(base);
}
</style>
<style lang="scss">
.custom-styling-picker {
  &.vc-chrome {
    width: 100%;
  }
  .vc-chrome-controls {
    align-items: center;
  }
  .vc-chrome-alpha-wrap {
    display: none;
  }
  .vc-chrome-fields-wrap {
    display: none;
  }
}
</style>
