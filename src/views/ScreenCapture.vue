<template>
  <div class="screen-container">
    <div v-if="showMessage">
      macOS 10.14 Mojave or higher requires consent for screen access. Please
      allow this app to access your Screen in Security & Privacy within system
      preferences to use this feature correctly.
    </div>
    <video v-show="stream" ref="video"></video>
    <button class="button-link" @click="select">Select Screen</button>
    <button ref="stop" class="button-link" @click="stop">Stop</button>
  </div>
</template>

<script>
import { desktopCapturer, remote } from "electron";
import FastColorAverage from "fast-average-color";
const { Menu } = remote;

// Get the available video sources

export default {
  data: function () {
    return {
      stream: null,
      sent: false,
    };
  },
  computed: {
    showMessage() {
      return process.platform === "darwin" && !this.stream;
    },
  },
  methods: {
    async select() {
      const inputSources = await desktopCapturer.getSources({
        types: ["window", "screen"],
      });
      const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map((source) => {
          return {
            label: source.name,
            click: () => this.selectSource(source),
          };
        })
      );

      videoOptionsMenu.popup();
    },
    async selectSource(source) {
      const constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
          },
        },
      };
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        console.error(e);
      }

      // Preview the source in a video element
      this.$refs.video.srcObject = this.stream;
      this.$refs.video.play();
      this.start();
    },
    stop() {
      this.stream = null;
      let tracks = this.$refs.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      this.$refs.video.srcObject = null;
    },
    async start() {
      if (!this._isDestroyed && this.stream) {
        const c = new FastColorAverage().getColor(this.$refs.video);
        const buff = Buffer.from([
          0x56,
          c.value[0],
          c.value[1],
          c.value[2],
          0x00,
          0xf0,
          0xaa,
        ]);
        try {
          await window.char.writeValue(buff);
          this.callback();
        } catch (e) {
          this.callback(e);
        }
      } else {
        return;
      }
    },
    callback(e) {
      if (e) return console.error(e);
      this.start();
    },
  },
};
</script>
<style lang="scss" scoped>
.screen-container {
  margin: spacing(section);
  text-align: center;
}
video {
  width: 100%;
}
button {
  margin: spacing(element);
}
canvas {
  width: 100%;
}
</style>
