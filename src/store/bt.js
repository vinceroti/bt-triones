export default {
  namespaced: true,
  state: {
    connected: false,
    connectedText: "disconnected",
    power:
      "Bluetooth is off. On your computer, make sure Bluetooth is turned on",
    deviceId: false,
  },
  getters: {
    connected: (state) => state.connected,
    connectText: (state) => state.connectedText,
    power: (state) => state.power,
    deviceId: (state) => state.deviceId,
  },
  mutations: {
    setConnection(state, status) {
      state.connected = status;
    },
    setConnectText(state, status) {
      state.connectedText = status;
    },
    setPower(state, status) {
      state.power = status;
    },
    setId(state, status) {
      state.deviceId = status;
    },
  },
  actions: {
    connect(context, status) {
      context.commit("setConnection", status);
    },
    connectText(context, status) {
      context.commit("setConnectText", status);
    },
    power(context, status) {
      context.commit("setPower", status);
    },
    deviceId(context, status) {
      context.commit("setId", status);
    },
  },
};
