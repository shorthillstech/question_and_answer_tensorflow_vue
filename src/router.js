import VueRouter from "vue-router";
import Vue from "vue";
import QNA from "./components/QNA.vue";



Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: "/",
            name: "QNA",
            component: QNA
        }
    ],
    mode: "history"
});