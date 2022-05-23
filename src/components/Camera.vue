<template>
  <div class="wrapper camera-frame">
    <!-- {{ photo }} -->
    <video
      v-show="!photo"
      class="video"
      :class="facingMode === 'user' ? 'front' : ''"
      ref="video"
    />
    <div v-show="photo">
      <canvas ref="canva" />
    </div>

    <button
      v-if="videoDevices.length > 1"
      class="button is-rounded is-outlined switch-button"
      @click="switchCamera"
      :disabled="switchingCamera"
    >
      <b-icon pack="fas" icon="sync-alt" />
    </button>
    <div class="photo-button-container">
      <button
        class="button photo-button"
        style="margin-right: 10px"
        @click="TakePhoto"
      >
        <b-icon pack="fas" icon="camera" />
      </button>
      <button
        class="button photo-button"
        style="margin-right: 10px"
        @click="ReTakePhoto"
      >
        <b-icon pack="fas" icon="sync-alt" />
      </button>
      <button class="button photo-button" @click="Send">
        <b-icon pack="fas" icon="paper-plane" />
      </button>
    </div>
    <!-- <photos-gallery class="gallery" :photos="photos" />
    <button class="button is-rounded is-outlined" @click="cropSelectedPhoto">Crop</button> -->
  </div>
</template>

<script>
// import PhotosGallery from "./PhotosGallery.vue";
import $ from 'jquery';
import axios from 'axios';
export default {
  components: {
    // PhotosGallery,
  },
  data() {
    return {
      photo: null,
      mediaStream: null,
      videoDevices: [],
      facingMode: "environment",
      counter: 0,
      switchingCamera: false,
      api_key:'Lql13ivF1XRBkXLNNnYbTQ==cYtKD5yHakflIJ7E',
    };
  },
  methods: {
    ReTakePhoto() {
      this.photo = null;
    },
    async StartRecording(facingMode) {
      this.facingMode = facingMode;
      let video = this.$refs.video;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      video.srcObject = this.mediaStream;
      return await video.play();
    },
    DataURLToFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    async TakePhoto() {
      let video = this.$refs.video;
      let canva = this.$refs.canva;
      let width = video.videoWidth;
      let height = video.videoHeight;
      canva.width = width;
      canva.height = height;
      let ctx = canva.getContext("2d");
      ctx.save();

      if (this.facingMode === "user") {
        ctx.scale(-1, 1);
        ctx.drawImage(video, width * -1, 0, width, height);
      } else {
        ctx.drawImage(video, 0, 0);
      }
      this.photo = this.DataURLToFile(canva.toDataURL(), "photo.png");
    },
    async switchCamera() {
      this.switchingCamera = true;
      const tracks = this.mediaStream.getVideoTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      await this.StartRecording(
        this.facingMode === "environment" ? "user" : "environment"
      );
      this.switchingCamera = false;
    },
    Send() {
      let formData = new FormData();
      formData.append("image", this.photo);
      axios.post('https://api.api-ninjas.com/v1/imagetotext', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'api-key': this.api_key,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        }
      })
    },
  },

  async mounted() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.videoDevices = devices.filter((d) => d.kind === "videoinput");
    await this.StartRecording(
      this.videoDevices.length === 1 ? "user" : "environment"
    );
  },
};
</script>

<style scoped>
.video.front {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
.wrapper {
  background-color: black;
  display: grid;
  width: auto;
  /* height: 100vh; */
  grid-template-columns: [left] 90vw [bs] 5vw [es] 5vw [right];
  grid-template-rows: [top] 5vh [bs] 5vh [es] 60vh [middle] 10vh [bottom] 20vh [end];
  justify-items: center;
  overflow: hidden;
}

.video {
  height: auto;
  grid-column: left/right;
  grid-row: top / bottom;
  user-select: none;
  max-width: unset;
}

.switch-button {
  grid-column: bs / es;
  grid-row: bs / es;
  z-index: 5;
  border-radius: 100%;
  width: 6vh;
  height: 6vh;
  font-size: 2vh;
}

.photo-button-container {
  grid-column: left / right;
  grid-row: middle / bottom;
  z-index: 5;
  width: 100vw;
  height: 10vh;
  display: flex;
  justify-content: center;
}

.photo-button {
  width: 10vh;
  height: 10vh;
  border-radius: 100%;
}

.photo-button {
  font-size: 4vh;
  color: black;
}
.gallery {
  grid-column: left / right;
  grid-row: bottom / end;
}

/* .camera-frame {
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
} */
</style>
