<template>
  <div>
    <cropper
      v-if="!cropedPhoto"
      class="cropper"
      :src="selectedPhoto"
      @change="change"
      ref="cropper"
    ></cropper>
    <img v-if="cropedPhoto" class="cropper" :src="cropedPhoto" height="150px" />
    <div class="btn-group">
      <b-button
          type="is-link"
          @click="crop"
          >
          Crop
      </b-button>
      <b-button
          type="is-info"
          @click="send"
          >
          Send
      </b-button>
    </div>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import axios from "axios";
export default {
  components: {
    Cropper,
  },
  data() {
    return {
      selectedPhoto: "",
      cropedPhoto: "",
      capturedPhotos: [],
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
    };
  },
  created() {
    this.capturedPhotos = this.$store.state.capturedPhotos;
    this.selectedPhoto = this.$store.state.selectedPhoto;
  },
  methods: {
    change({ coordinates, canvas }) {
      alert(coordinates, canvas);
      // console.log(coordinates, canvas);
    },
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult();
      this.coordinates = coordinates;
      // You able to do different manipulations at a canvas
      // but there we just get a cropped image, that can be used
      // as src for <img/> to preview result
      this.cropedPhoto = canvas.toDataURL();
    },
    send(){
      let image = this.cropedPhoto;
      // let data = {
      //   capturedPhotos: this.capturedPhotos,
      //   cropedPhoto: this.cropedPhoto,
      // }

      axios.post("http://13.235.242.44/api/v1/ocr", {image}).then((response) => {
        // console.log('response =>',response.data);
        alert(response.data.text);
      }).catch((error) => {
        // console.log(error);
        alert(error);
      });
    }
  },
};
</script>

<style scoped>
.cropper {
  /* height: 600px; */
  background: #ddd;
}
.btn-group {
  margin-top: 20px;
  text-align: center;
}
.btn-group button {
  margin: 5px;
}
</style>
