export default {
  namespaced: true,
  state: {
    connected: false,
  },
  getters: {
    connected: (state) => state.connected,
  },
  mutations: {
    setConnection(state, status) {
      state.connected = status;
    },
  },
};
