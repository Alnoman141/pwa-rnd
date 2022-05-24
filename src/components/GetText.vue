<template>
  <div class="container">
      <h1>Get Seleted Texts</h1>
      <ul>
          <li v-for="(txt, index) in data" :key="index">{{ txt.text }}</li>
      </ul>
  </div>
</template>

<script>
export default {
    data(){
        return {
            data: null,
        }
    },
    created(){
        this.data = this.$route.params.data;
        console.log(this.$route.params);
    }

}
</script>

<style scoped>
.container {
    width: 80%;
    margin: 0 auto;
}
</style>