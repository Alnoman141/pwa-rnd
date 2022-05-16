<template>
  <div>
    <cropper
      class="cropper"
      :src="img"
      @change="change"
      ref="cropper"
    ></cropper>
    <button @click="crop">
		Crop
	</button>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
export default {
    components: {
        Cropper
    },
    data() {
        return {
            img: '',
            coordinates: {
				width: 0,
				height: 0,
				left: 0,
				top: 0,
			},
        }
    },
    created() {
        this.img = this.$route.params.src;
    },
    methods: {
        change({coordinates, canvas}) {
            console.log(coordinates, canvas)
        },
        crop() {
			const { coordinates, canvas, } = this.$refs.cropper.getResult();
			this.coordinates = coordinates;
			// You able to do different manipulations at a canvas
			// but there we just get a cropped image, that can be used 
			// as src for <img/> to preview result
			this.img = canvas.toDataURL();
		},
    },
}
</script>

<style scoped>
.cropper {
  height: 600px;
  background: #DDD;
}
</style>