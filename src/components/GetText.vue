<template>
  <div class="container">
      <h1>You Seleted:  </h1>
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
h1 {
    font-weight: 900;
    font-size: 32px;
}
</style>