<template lang="pug">
#root.container.md-layout-column
	md-dialog(:md-active.sync="showDialog")
		md-dialog-title Log In
	md-app
		md-app-toolbar.md-primary
			span.md-title Simbot Web
			.md-toolbar-section-end
				md-button.md-raised(v-if="!auth")
					md-avatar.md-avatar-icon.md-small
						md-icon person
					span &nbsp; SIGN IN &nbsp;
				md-menu(md-size="huge" v-else :md-offset-x="-500" :md-offset-y="-50")
					md-button.md-icon-button(md-menu-trigger)
						md-icon person
					md-menu-content
						md-menu-item
							md-icon person
							span.md-list-item-text Username


		md-app-content(v-if="roomList.length == 0")
			md-empty-state(
				md-icon="tv_off"
				md-label="No room created",
				md-description="Log in to create a room"
			)
		md-app-content(v-else)
			p 'Poggers'
</template>

<script>
export default {
	name: 'App',
	data: ()=>({
		auth: false,
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
	accent: md-get-palette-color(white, A200),
	theme: dark
));

@import "~vue-material/dist/theme/all";
</style>
