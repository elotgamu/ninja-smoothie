import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import AddSmoothie from "@/views/AddSmoothie.vue";
import EditSmoothie from "@/views/EditSmoothie.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
    {
      path: "/add-smoothie",
      name: "AddSmoothie",
      component: AddSmoothie
    },
    {
      path: "/edit-smoothie/:slug",
      name: "EditSmoothie",
      component: EditSmoothie
    }
  ]
});
