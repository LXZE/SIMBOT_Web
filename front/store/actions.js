export const createRoom = ({ commit }, roomData) => {
	commit('CREATE_ROOM',{
		roomData: roomData,
	})
}

export const deleteRoom = ({ commit }, roomIdx) => {
	confirm('This room will deleted from server, proceed?')
	? commit('DELETE_ROOM',{
		roomIdx: roomIdx
	}) : '';
}