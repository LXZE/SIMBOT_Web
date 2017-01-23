import App from './components/App.vue';
import Watch from './components/Watch.vue';
const routes = [
  { name: 'index', path: '/', component: App },
  { name: 'watch', path: '/watch/:roomID', component: Watch },
];
module.exports = routes;