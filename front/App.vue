<template lang="pug">
#root.container.md-layout-column
	app_header()
	md-content(v-if="roomList.length == 0")
		md-empty-state(
			md-icon="tv_off"
			md-label="No room created",
			md-description="Log in to create a room"
		)
	md-content(v-else)
		p 'Poggers'
</template>

<script>
import Vue from 'vue'
// import loginModal from './components/loginModal'
import app_header from './components/header'

export default {
	name: 'App',
	components: {
		'app_header': app_header
	},
	data: ()=>({
		roomList: [],
	}),
	mounted (){
	},
	methods: {
	},
	computed: {
	},
	created () {
	},
	watch: {
	}
}
</script>

<style lang="scss">

.container {
	// min-height: 300px;
	overflow: hidden;
	position: relative;
	border: 1px solid rgba(#000, .12);
}

@import "~vue-material/dist/theme/engine";

@include md-register-theme("default", (
	primary: md-get-palette-color(grey, A200),
	accent: md-get-palette-color(white, A200),
	theme: dark
));

@import "~vue-material/dist/theme/all";
</style>
