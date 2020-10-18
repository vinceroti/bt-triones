export default {
  namespaced: true,
  state: {
    micPermission: null,
  },
  getters: {
    micPermission: (state) => state.micPermission,
  },
  mutations: {
    setMicPermission(state, status) {
      state.micPermission = status;
    },
  },
  actions: {
    micPermission(context, status) {
      context.commit("setMicPermission", status);
    },
  },
};
