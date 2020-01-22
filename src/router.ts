import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home/Home.vue';
import ShowData from './views/ShowData.vue';
import Statistics from './views/Statistics/Statistics.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:name/:id',
      name: 'home',
      component: Statistics,
    },
    {
      path: '/:companyId',
      name: 'home',
      component: Statistics,
    }
  ],
});
