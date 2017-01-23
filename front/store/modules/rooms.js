const state = {
  rooms: [],
  i: 0,
}

const getters = {
  roomList: state => state.rooms
}

const actions = {
  getRooms ({commit}) {
    commit('RECEIVE_ROOMS',{ rooms })
  },

  createRoom ({ commit }, roomData) {
    commit('CREATE_ROOM',{
      roomData: roomData,
    })
  },

  deleteRoom ({ commit }, roomIdx) {
    confirm('This room will deleted from server, proceed?')
    ? commit('DELETE_ROOM',{
      roomIdx: roomIdx
    }) : '';
  },
}

const mutations = {
  ['RECEIVE_ROOMS'] (state, { rooms }){
    state.rooms = rooms
  },

  ['CREATE_ROOM'] (state, { roomData }){
    console.log(roomData.maxPlayer,roomData.roomName,roomData.robotPerPlayer);
    state.rooms.push({
      roomName: roomData.roomName + ' ' + state.i,
      status: 'wait',
      roomID: state.i,
      roomToken: 'nkpfndund'
    });
    state.i+=1;
  },

  ['DELETE_ROOM'] (state, {roomIdx}){
    state.rooms.splice(roomIdx,1);
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}