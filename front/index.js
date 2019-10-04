import Vue from 'vue'
import Vuex from 'vuex'

import VueMaterial from 'vue-material'
import VueCookies from 'vue-cookies'
import VueRouter from 'vue-router'

import App from './App'
import store from './store/store'
import routes from './routes';

import 'vue-material/dist/vue-material.min.css'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(VueCookies)

const router = new VueRouter({
	routes,
	mode: 'history',
	saveScrollPosition: true
})

const app = new Vue({
	router,
	store,
	el: '#app',
	render: h => h(App),
})
window.router = router
