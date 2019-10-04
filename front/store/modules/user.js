const state = {
	auth_status: false,
}

const getters = {
	auth_status: 	state => state.auth_status,
}

const actions = {

}

const mutations = {
	['set_user_auth_status'] (state, new_auth_status){
		state.auth_status = new_auth_status
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
