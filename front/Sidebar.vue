<template lang="pug">
.sidenav
  ul
    li: a(@click='show.Modal = true') Create Room
  #Modal
    ui-modal(:show.sync='show.Modal',type=large header='Create Room')
      form
        input(type='text',placeholder='test')
      div(slot=footer)
        ui-button(@click='show.Modal = false') cancel
        ui-button(color=primary) Create

</template>
<script>
export default {
  name: 'Sidebar',
  data () {
    return {
      show:{
        Modal: false,
      }
    }
  }
}
</script>


<style lang="scss">
.sidenav {
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  padding-top: 60px;
  ul li {
    text-align: center;
    a {
      text-decoration: none;
      font-size: 25px;
      color: #818181;
      display: block;
      transition: 0.3s
    }
  }
}
.sidenav ul li a:hover, .offcanvas a:focus{
    color: #f1f1f1;
}
</style>