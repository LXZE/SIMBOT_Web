<template lang="pug">
#root
	v-toolbar(dark)
		v-toolbar-title Simbot Web V 0.1
		v-spacer
		v-btn(icon)
			v-icon refresh

	.container
		p Hello World!
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
    }
  }
}
</script>

<style>
#root {
	font-family: 'Roboto'
}
</style>

