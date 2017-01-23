import Vue from 'vue'
const state = {
  rooms: {},
  count: 0,
}

const getters = {
  roomList: state => state.rooms,
  roomCount: state => state.count,
}

const actions = {
  getRooms ({commit}) {
    Vue.http.get('/room').then((res)=>{
      commit('RECEIVE_ROOMS',{rooms:res.data, count:Object.keys(res.data).length});
    })
  },

  createRoom ({ commit, dispatch }, roomData) {
    let data = {
      roomName: roomData.roomName,
      maxPlayer: roomData.maxPlayer,
      robotPerPlayer: roomData.robotPerPlayer,
    }
    Vue.http.post('/create',data).then((res)=>{
      dispatch('getRooms'); 
    });
  },

  deleteRoom ({ commit, dispatch }, roomID) {
    confirm(`This room [${roomID}] will deleted from server, proceed?`)
    ?
      Vue.http.delete(`/${roomID}`).then((res)=>{
        commit('DELETE_ROOM',roomID);
        dispatch('getRooms');
      })
    : '';
  },
}

const mutations = {
  ['RECEIVE_ROOMS'] (state,payload){
    state.rooms = payload.rooms;
    state.count = payload.count;
  },

  ['DELETE_ROOM'] (state, {roomID}){
    delete state.rooms[roomID];
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}