import Vue from 'vue'
import Vuex from 'vuex'
import addRouters from './permission/addRouters'
import detail from './detail/detail'
import deploy from './deploy/deploy'
import menuTabs from './menu'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    addRouters,
    detail,
    deploy,
    menuTabs
  },
})
