import Vue from 'vue';
import App from './App.vue';

import VueResource from 'vue-resource';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Element from 'element-ui';

// Vue.use(VueResource);
// Vue.use(Vuex);
// Vue.use(VueRouter);
Vue.use(Element);

var app = new Vue({
  el: '#root',
  render: (h)=>{ return h(App) }
  // components: {
  // 	App
  // }
})
