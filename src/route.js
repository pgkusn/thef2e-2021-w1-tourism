import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/:name?',
            component: Home,
            props: route => ({
                name: route.params.name || 'ScenicSpot'
            })
        }
    ]
});