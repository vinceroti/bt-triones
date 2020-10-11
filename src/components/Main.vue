<template>
  <div>{{ btConnected }}</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "main",
  props: {
    msg: String,
  },
  computed: {
    ...mapGetters({ btConnected: "bt/connected" }),
  },
};
</script>
