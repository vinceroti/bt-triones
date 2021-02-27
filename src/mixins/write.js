const write = {
  methods: {
    toggleDevice: (code) => {
      if (window.char) {
        const buff = Buffer.from([0xcc, code, 0x33]);
        window.char.write(buff, true, write.methods.defaultCallback);
      }
    },
    defaultCallback: (e) => {
      if (e) console.error(e);
    },
  },
};

export default write;
