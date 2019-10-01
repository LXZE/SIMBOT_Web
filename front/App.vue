<template lang="pug">
#root.container.md-layout-column
	md-dialog(:md-active.sync="showDialog")
		md-dialog-title Log In
	md-app
		md-app-toolbar.md-primary
			span.md-title Simbot Web
			.md-toolbar-section-end
				md-button.md-icon-button(
					@click="showDialog = true"
				)
					md-icon person
		md-app-content(v-if="roomList.length == 0")
			md-empty-state(
				md-icon="dynamic_feed"
				md-label="Create a room first",
			)
		md-app-content(v-else)
			p 'Poggers'
</template>

<script>
export default {
	name: 'App',
	data: ()=>({
		roomList: [],
		showDialog: false,
	}),
	methods: {
		addRoom () {
			
		}
	},
	computed: {
	},
	created () {
		this.roomList = []
	},
	watch: {
		showDialog: (newVal, oldVal) => {
			console.log(newVal)
		}
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
	accent: md-get-palette-color(deeporange, A200),
	theme: dark
));

@import "~vue-material/dist/theme/all";
</style>
