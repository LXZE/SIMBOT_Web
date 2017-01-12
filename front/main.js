import Vue from 'vue'
import App from './App.vue'
import keen from 'keen-ui';
import VueResource from 'vue-resource';
import Vuex from 'vuex'
import VueRouter from 'vue-router'
Vue.use(keen);
Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(VueRouter);

var app = new Vue({
  el: '#root',
  // render: (h)=>{ return h(App) }
  components: {
  	App
  }
})
