import Vue from 'vue'
import App from './App'
import VueMaterial from 'vue-material'
import VueCookies from 'vue-cookies'
import VueRouter from 'vue-router'

import routes from './routes';
import 'vue-material/dist/vue-material.min.css'

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
	// store,
	el: '#app',
	render: h => h(App),
})
window.router = router
