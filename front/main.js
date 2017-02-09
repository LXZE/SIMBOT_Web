import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios'
import VueAxios from 'vue-axios'

import Element from 'element-ui';

import routes from './routes';
import store from './store';

Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(Element);
Vue.prototype.$http = axios;

const router = new VueRouter({
	routes
});
const app = new Vue({
	router,
	store,
	watch: {
	    '$route' (to, from) {
	    	
	    }
  }

}).$mount('#root');