import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Element from 'element-ui';

import App from './App.vue';
import Watch from './Watch.vue';

Vue.use(VueResource);
// Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Element);

const routes = [
  { name: 'index', path: '/', component: App },
  { name: 'watch', path: '/watch/:roomID', component: Watch },
];
const router = new VueRouter({
	routes
});
const app = new Vue({
	router,
	watch: {
	    '$route' (to, from) {
	      // console.log('test')
	    }
  }

}).$mount('#root');