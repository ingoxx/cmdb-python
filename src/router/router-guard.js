import router from './index'
import store from "../store/index"

router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem('token')) {
    // 这里是判断页面是否需要登录才能访问
    if (to.matched.length > 0 && !to.matched.some(record => record.meta.requireAuth)) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 已登录,显示对应用户权限的页面
    if (!store.state.addRouters.permissionList) {
      store.dispatch("get_permission").then(() => {
        next(to.path)
      })
    } else {
      if (to.path !== "/login") {
        next()
      } else {
        next(from.fullPath)
      }
    }
  }
});
