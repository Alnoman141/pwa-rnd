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
    <div class="selectedTxt">
      <p v-for="(txt, index) in selectedTexts" :key="index">{{ txt.text }}</p>
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
        v-if="!loading"
        class="button photo-button"
        style="margin-right: 10px"
        @click="ReTakePhoto"
      >
        <b-icon pack="fas" icon="sync-alt" />
      </button>
      <button
        v-if="!loading"
        class="button photo-button"
        style="margin-right: 10px"
        @click="TakePhoto"
      >
        <b-icon pack="fas" icon="camera" />
      </button>
      
      <button v-if="photo && !loading" class="button photo-button" style="margin-right: 10px" @click="Send">
        <b-icon pack="fas" icon="paper-plane" />
      </button>
      <button v-if="selectedTexts.length > 0 && !loading" class="button photo-button" @click="Next">
        <b-icon pack="fas" icon="arrow-right" />
      </button>
      <b-button type="is-dark" v-if="loading" loading>Sending</b-button>
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
      photo: "",
      loading: false,
      mediaStream: null,
      videoDevices: [],
      facingMode: "environment",
      counter: 0,
      switchingCamera: false,
      api_key:'Lql13ivF1XRBkXLNNnYbTQ==cYtKD5yHakflIJ7E',
      canva: null,
      selectedTexts: [],
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
      this.canva = this.$refs.canva;
      let width = video.videoWidth;
      let height = video.videoHeight;
      this.canva.width = width;
      this.canva.height = height;
      let ctx = this.canva.getContext("2d");
      ctx.save();

      if (this.facingMode === "user") {
        ctx.scale(-1, 1);
        ctx.drawImage(video, width * -1, 0, width, height);
      } else {
        ctx.drawImage(video, 0, 0);
      }
      this.photo = this.DataURLToFile(this.canva.toDataURL(), "photo.png");
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
      this.loading = true;
      let formData = new FormData();
      formData.append("image", this.photo);
      axios.post('https://api.api-ninjas.com/v1/imagetotext', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Key': this.api_key,
        }
      }).then(response => {
        this.loading = false;
        let ctx = this.canva.getContext("2d");
        let data = response.data;
        let texts = [];
        data.forEach((element, index) => {
          // make bounding box clickable
          // ctx.beginPath();
          ctx.rect(element.bounding_box.x1, element.bounding_box.y1, element.bounding_box.x2 - element.bounding_box.x1, element.bounding_box.y2 - element.bounding_box.y1);
          ctx.stroke();
          ctx.fillStyle = "red";
          ctx.font = "10px Arial";
          
          // add click event
          this.canva.addEventListener('click', (e) => {
            if (e.offsetX >= element.bounding_box.x1 && e.offsetX <= element.bounding_box.x2 && e.offsetY >= element.bounding_box.y1 && e.offsetY <= element.bounding_box.y2) {
              ctx.fillText(element.text, element.bounding_box.x1, element.bounding_box.y1);
              
              let txt = {
                index: index,
                text: element.text,
              }
              if(texts.length < 0) {
                texts.push(txt);
              } else {
                let found = false;
                texts.forEach((text, idx) => {
                  if(text.index == index) {
                    found = true;
                    ctx.fillText(element.text, 0, 0);
                    texts.splice(idx, 1);
                  }
                });
                if(!found) {
                  texts.push(txt);
                }
              }
            }
          });
        });
        this.selectedTexts = texts;
        
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    },
    Next() {
      this.$router.push({
          name: 'getText',
          params: {
            data: this.selectedTexts,
          }
        });
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
  /* height: auto; */
  height: 100vh;
  grid-template-columns: [left] 90vw [bs] 5vw [es] 5vw [right];
  grid-template-rows: [top] 5vh [bs] 5vh [es] 60vh [middle] 10vh [bottom] 20vh [end];
  justify-items: center;
  overflow: hidden;
}

.video {
  /* grid-column: left/right;
  grid-row: top / bottom; */
  position: relative;
  user-select: none;
  max-width: unset;
  max-height: unset;
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
  /* grid-column: left / right;
  grid-row: middle / bottom; */
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  /* width: 100vw; */
  /* height: 10vh; */
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
.selectedTxt {
  position: absulute;
  top: 0;
  left: 0;
  width: 108vh;
  /* height: 10vh; */
  background-color: rgba(0, 0, 0, 1);
  z-index: 3;
  color: white;
  /* font-size: 4vh; */
  box-sizing: content-box;
}
/* .camera-frame {
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
} */
.selectedTxt p {
  background-color: rgba(0, 0, 0, 1);
}
</style>
