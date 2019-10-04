<template lang="pug">
md-toolbar.md-primary
	//- dialog
	md-dialog(:md-active.sync="showLoginDialog")
		form.md-layout(novalidate @submit.prevent="")
			md-card(class="md-layout-item")
				md-card-header
					.md-title Sign in to Simbot
				md-card-content
					md-field
						label username
						md-input(v-model="username")
				md-card-actions
					md-button(class="md-accent" @click="showLoginDialog = false") Cancel
					md-button(class="md-raised md-accent" @click="loginRequest") Sign in

	//- Actual Header
	span.md-title Simbot Web
	.md-toolbar-section-end
		md-button.md-raised(v-if="!auth_status" @click="showLoginDialog = true")
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
					md-button(@click="logout") Logout
</template>

<script>
import { mapGetters } from "vuex"

export default {
	name: 'app_header',
	props: [
		'auth',
	],
	data: ()=>({
		username:'',
		showLoginDialog: false,
	}),
	mounted () {
	},
	methods: {
		loginRequest () {
			this.$store.commit('set_user_auth_status', true)
			this.showLoginDialog = false
		},
		logout () {
			this.$store.commit('set_user_auth_status', false)
		}
	},
	computed: {
		...mapGetters(['auth_status'])
		
	},
	created () {

	},
	watch: {
		auth: (val)=>{
			console.log(val)
		}
	}
}
</script>

<style lang="scss">
</style>
