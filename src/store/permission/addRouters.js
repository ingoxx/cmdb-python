import { checkPerms } from '../../api'
import router, { showDynamicRoutes } from '../../router/index'
import dynamicRouter from '../../router/all-dynamic-router'
import { showRouter } from '../../utlis/diff-router'

const addRouters = {
  namespace: true,
  state: {
    permissionList: null
  },
  getters: {},
  mutations: {
    SET_PERMISSION(state, routes) {
      state.permissionList = routes
    },
    CLEAR_PERMISSION(state, data) {
      state.permissionList = data
    }
  },
  actions: {
    async get_permission(store) {
      // 获取用户的权限
      let permissionList = await checkPerms({});
      // 获取到用户的权限跟前端定义好的所有路由进行对比获取差异
      if (permissionList.data.status !== 666) {
        return this.$message.error(permissionList.data.msg)
      }
      let showRoutes = showRouter(permissionList.data.data, dynamicRouter);
      // 获取首页路由,首页默认所有已经登录的用户都可以访问
      let main = showDynamicRoutes.find(v => v.path === '/');
      // 获取首页下的子路由
      let children = main.children;
      // 将上面对比的路由结果添加到首页的子路由下
      children.push(...showRoutes);
      // 添加对比过后的路由
      router.addRoutes(showDynamicRoutes);
      // mutations修改不同用户所拥有的路由访问权限
      store.commit('SET_PERMISSION', showRoutes)
    }
  }
};

export default addRouters

