export default {
  namespaced: true,
  state: {
    connected: false,
  },
  getters: {
    connected: (state) => state.connected,
  },
  mutations: {
    changeConnection(state, status) {
      state.connected = status;
    },
  },
  actions: {
    set(context, status) {
      context.commit("changeConnection", status);
    },
  },
};
