<template lang="pug">
.watch
	router-link(to="/")
		button
			i.el-icon-arrow-left
	canvas
	p room id {{ $route.params.roomID }}
</template>

<script>
export default {
	name: 'Watch',
	data () {
		return {

		}
	}
}
</script>

<style lang="scss">
	
</style>