import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);


export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login')
  },
  {
    path: '/mfa/:user/:mfaimg/:mfasatus',
    name: 'mfa',
    component: () => import('../views/login/googleauth')
  },
];




// 动态加载路由
export const showDynamicRoutes = [
  {
    path: '/',
    name: 'home',
    redirect: 'index',
    component: () => import('../views/home/Home'),
    meta: { requireAuth: true, name: '首页', keepAlive: false },
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import('../views/index/Index'),
        meta: { name: '首页', keepAlive: false },
        hidden: true
      }
    ]
  },
  {
    path: '/platforms/update/:name/:title/:file/:domain',
    name: 'package-update',
    component: () => import('../views/platforms/updatePackage'),
    meta: { requireAuth: true, name: '更新游戏包', keepAlive: true },
  },
  {
    path: '/assets/action/:project/:ip/:action',
    name: 'assets-action',
    component: () => import('../views/assets/assetsActions'),
    meta: { requireAuth: true, name: '更新进程', keepAlive: false },
  },
  {
    path: '/assets/deploy/:project/:ip/:action',
    name: 'deploy-action',
    component: () => import('../views/assets/deployActions'),
    meta: { requireAuth: true, name: '项目部署', keepAlive: false },
  },
  {
    path: '*',
    component: () => import('../views/forbidden/401')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
