<template>
  <div class="container">
    <h1>Your Search Result Is:  </h1>
    <h3>Total Found: {{ data.total }}</h3>

    <b-field>
        <div>
            <b-radio-button v-model="radioButton"
                :native-value="txt.name"
                :type=" radioButton === txt.name ? 'is-success is-light is-outlined' : ''" v-for="(txt, index) in data.data" :key="index">
                <span>{{ txt.name }}</span>
            </b-radio-button>
        </div>
    </b-field> 
    <button class="button is-info is-rounded is-outlined" @click="getData">Get Text</button>
  </div>
</template>

<script>
export default {
    data(){
        return {
            data: null,
            radioButton: '',
        }
    },
    created(){
        this.data = this.$route.params.data;
        console.log(this.$route.params);
    },
    methods: {
        getData(){
            alert(this.radioButton);
        }
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
 h3 {
    font-weight: 900;
    font-size: 24px;
 }

 button {
    display: block;
    margin: 20px auto;
 }
</style>