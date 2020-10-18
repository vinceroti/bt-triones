<template>
  <ul class="status">
    <li>Connected: {{ btText }}</li>
    <li>Power: {{ btPower }}</li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    msg: String,
  },
  computed: {
    ...mapGetters({ btText: "bt/connectText", btPower: "bt/power" }),
  },
};
</script>
<style lang="scss" scoped>
.status {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
  li {
    margin: spacing(element) 0;
    &::after {
      content: "";
      margin: 0 5px;
      border-right: 1px solid;
    }
    &:last-child {
      &::after {
        border: 0;
        margin: 0;
      }
    }
  }
}
</style>
