const write = {
  methods: {
    toggleDevice: async (code) => {
      if (window.char) {
        const buff = Buffer.from([0xcc, code, 0x33]);
        await window.char.writeValue(buff);
      }
    },
  },
};

export default write;
