<template>
  <div>
    <div>
      <v-easy-camera v-model="picture"> </v-easy-camera>
    </div>
    <b-button
      v-if="picture"
      id="send-btn"
      label="Send"
      icon-pack="fas"
      icon-right="paper-plane"
      @click="send"
    />
  </div>
</template>

<script>
import EasyCamera from "easy-vue-camera";
// import axios from 'axios';
import $ from 'jquery';
export default {
  components: {
    "v-easy-camera": EasyCamera,
  },
  data() {
    return {
      picture: null,
      api_key:'Lql13ivF1XRBkXLNNnYbTQ==cYtKD5yHakflIJ7E',
    };
  },
  methods: {
    send() {
    //     console.log(this.picture);
    //   axios.post(`https://api.api-ninjas.com/v1/imagetotext`, { headers: { 'X-Api-Key': this.api_key, 'contentType' : 'application/json'} }, this.picture).then(res => {
    //     console.log(res);
    //   }).catch(err => {
    //     console.log(err);
    //   });
    var formData = new FormData();
    formData.append('image', this.picture);
    $.ajax({
        method: 'POST',
        url: 'https://api.api-ninjas.com/v1/imagetotext',
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers: {
            'X-Api-Key': this.api_key,
            'contentType' : 'application/json'
        },
        success: function(result) {
            console.log(result);
        },
        error: function ajaxError(jqXHR) {
            alert(jqXHR.responseText);
        }
    });
    },
  },
};
</script>

<style scoped>
.camera-stack-controls-wrapper {
    position: relative;
}
#send-btn {
    z-index: 20;
    position: absolute;
    top: 86%;
    left: 8%;
}
</style>
