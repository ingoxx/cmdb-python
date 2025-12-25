import { userDetail } from '@/api'

const detail = {
  namespace: true,
  state: {
    userDetails: null
  },
  getters: {},
  mutations: {
    CHANGE_DETAIL (state, data) {
      state.userDetails = data
    },
    CLEAR_DETAIL (state, data) {
      state.userDetails = data
    },
  },
  actions: {
    async getUserDetail (store) {
      await userDetail({}).then((res) => {
        if (res.data.status !== 666){
          this.$message.error('获取用户信息失败')
        }
        store.commit('CHANGE_DETAIL', res.data.data);
      }).catch(() => {
        this.$message.error('请求失败')
      });
    }
  }
};

export default detail

