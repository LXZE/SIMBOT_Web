import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

import Element from 'element-ui';
import VueStomp from "vue-stomp";

import routes from './routes';
import store from './store';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Element);
Vue.use(VueStomp, 'http://localhost:15674/stomp');

const router = new VueRouter({
	routes
});
const app = new Vue({
	router,
	store,
	watch: {
	    '$route' (to, from) {
	      // console.log('test')
	    }
  }

}).$mount('#root');