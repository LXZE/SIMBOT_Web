<template lang="pug">
.sidenav
  ul
    li: a(@click="show.Modal = true")
      i.el-icon-plus()
        p &nbsp;
      p(type="button") Create Room
  #Modal
    el-dialog(title="Create a new room", v-model="show.Modal")
      el-form(:model="form", ref="form" )

        el-form-item(label="Room name")
          el-input(placeholder="Enter room name", v-model="form.roomName", auto-complete="off")
        el-form-item
          el-col(:span="11")
            label Max player
            el-input(placeholder="4", v-model="form.maxPlayer", auto-complete="off")          
          el-col(:span="2")
            p &nbsp;
          el-col(:span="11")
            label Robot per player
            el-input(placeholder="1", v-model="form.robotPerPlayer", auto-complete="off")
      span.dialog-footer(slot='footer')
        el-button(@click="show.Modal = false") Cancel
        el-button(type="primary", @click="createRoom(form); show.Modal = false") Create
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Sidebar',
  data () {
    return {
      show:{
        Modal: false,
      },
      form:{}
    }
  },
  methods: mapActions([
    'createRoom',
  ]),
  created () {
    this.form = {
        roomName: 'Untitled',
        maxPlayer: 4,
        robotPerPlayer: 1,
      }
  }
}
</script>

<style lang="scss">
.sidenav {
  height: 100%;
  width: 20%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  padding-top: 20px;
  ul{
    padding-left: 5px;
    li {
      display: inline-block;
      font-size: 25px;
      text-align: center;
      a {
        font-size: 2vw;
        color: #818181;
        transition: 0.3s;
        * {
          display:inline-block;
        }
      }
    }
  }
}
.sidenav ul li a:hover, .offcanvas a:focus{
    color: #f1f1f1;
}
#Modal {
    z-index:10;
}
</style>