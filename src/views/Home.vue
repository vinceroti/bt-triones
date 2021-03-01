<template>
  <div>
    <div class="on-off" :class="{ sending }">
      <button ref="button" class="button-primary" @click="toggleDevice(0x23)">
        Turn On
      </button>
      <button ref="button" class="button-primary" @click="toggleDevice(0x24)">
        Turn Off
      </button>
    </div>
    <multiselect
      v-model="dropdownValue"
      placeholder="Mode Selection"
      :options="dropDownOptions"
      track-by="name"
      label="name"
      :class="{ sending }"
      @select="select"
    ></multiselect>
    <vue-slider v-model="sliderValue" :class="{ sending }" />
    <chrome-picker
      v-model="colorPicker"
      class="custom-styling-picker"
      @change="slide"
      @input="inputColor"
    />
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import converter from "hex2dec";
import { Chrome } from "vue-color";
import debounce from "lodash/debounce";
import { mapActions } from "vuex";
import write from "../mixins/write";

export default {
  components: {
    Multiselect,
    "chrome-picker": Chrome,
  },
  mixins: [write],
  data() {
    return {
      sending: false,
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
  methods: {
    ...mapActions({
      sColor: "bt/color",
    }),
    async select(e) {
      if (window.char) {
        const buff = Buffer.from([0xbb, e.code, this.speed, 0x44]);
        await window.char.writeValue(buff);
      }
    },
    slide(e) {
      // const dec = Math.round((e / 100) * 255);
      this.speed = converter.decToHex(Math.abs(e - 100).toString());
      if (this.dropdownValue) this.select(this.dropdownValue);
    },
    inputColor: debounce(async function (e) {
      if (window.char && !this.sending) {
        this.sending = true;
        const buff = Buffer.from([
          0x56,
          e.rgba.r,
          e.rgba.g,
          e.rgba.b,
          0x00,
          0xf0,
          0xaa,
        ]);
        try {
          await window.char.writeValue(buff);
        } catch (e) {
          console.error(e);
        }
        this.sending = false;
        this.sColor([e.rgba.r, e.rgba.g, e.rgba.b]);
      }
    }, 0),
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
.sending {
  pointer-events: none;
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
