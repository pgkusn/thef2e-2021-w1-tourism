import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import route from './route';
import './index.scss';

createApp(App).use(store).use(route).mount('#app');