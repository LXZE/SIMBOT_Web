<template lang="pug">
#app
	Sidebar
	Container
</template>

<script>
import Sidebar from './Sidebar.vue';
import Container from './Container.vue';
export default {
	name: 'App',
	components: {
		Sidebar,
		Container
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin-top: 10px;
}

h1, h2 {
	font-weight: normal;
}
</style>
