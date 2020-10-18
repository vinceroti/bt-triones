const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin");

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/assets/scss/abstracts/_index.scss";`,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      nodeIntegration: true,
    },
  },
  configureWebpack: {
    plugins: [
      new GoogleFontsPlugin({
        fonts: [
          {
            family: "Commissioner",
            variants: ["400", "400italic", "700", "700italic"],
          },
        ],
        /* ...options */
      }),
    ],
  },
};
