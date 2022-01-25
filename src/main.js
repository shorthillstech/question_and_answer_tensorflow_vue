
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import VueChatScroll from 'vue-chat-scroll';


Vue.config.productionTip = false
Vue.config.ignoredElements = [/^ion-/]
Vue.use(VueChatScroll);
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
