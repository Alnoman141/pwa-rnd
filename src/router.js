import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import CropPhoto from "./components/CropPhoto.vue";
import Camera from "./components/Camera.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/take-photo',
      name: 'camera',
      component: Camera
    },
    {
      path: '/crop-photo',
      name: 'crop-photo',
      component: CropPhoto
    }
  ]
});
