<template>
  <div class="photo">
    <input type="radio" id="checkbox" name="photo" @change="getSelectedPhoto">
    <img :src="src" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null,
    },
  },
  methods: {
    getSelectedPhoto() {
      this.$store.dispatch('getSelectedPhoto', this.src);
    },
  }
};
</script>

<style scoped>
img {
  height: 100%;
}
.photo {
  position: relative;
}
#checkbox {
  height: 30px;
  width: 30px;
  position: absolute;
  top: 0;
  right: 0;
}
</style>