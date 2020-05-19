import Vue from 'vue'
import Router from 'vue-router'
import RouterHelper from '../core/RouterHelper'
import layouts from './layouts'
import routers from './routers'

Vue.use(Router);


const routesHelper = new RouterHelper({layouts, routers});
export const routes = routesHelper.build();

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
routesHelper.bindEvents(router);

export default router;
