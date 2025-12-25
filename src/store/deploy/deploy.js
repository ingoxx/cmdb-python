const deploy = {
  namespace: true,
  state: {
    deployInfo: {
      projectName: "",
      dbIp: "",
      slaveIp: "",
      dbPort: "",
      dbPassword: "",
      gameIp: "",
      rw: 2,
      frontIp: "",
      select : 100,
      project: "",
      ip: "",
      action: "",
    },
  },
  getters: {},
  mutations: {
    GET_PROJECT_NAME (state, data) {
      state.deployInfo.projectName = data
    },
    GET_DB_IP(state, data) {
      state.deployInfo.dbIp = data
    },
    GET_DB_SLAVE_IP(state, data) {
      state.deployInfo.slaveIp = data
    },
    GET_DB_PORT(state, data) {
      state.deployInfo.dbPort = data
    },
    GET_DB_PASSWORD(state, data) {
      state.deployInfo.dbPassword = data
    },
    GET_GAME_IP(state, data) {
      state.deployInfo.gameIp = data
    },
    RW_ON_OFF(state, data) {
      state.deployInfo.rw = data
    },
    FRONT_IP(state, data) {
      state.deployInfo.frontIp = data
    },
    SERVER_PROJECT_NAME(state, data) {
      state.deployInfo.project = data
    },
    SERVER_IP(state, data) {
      state.deployInfo.ip = data
    },
    SERVER_ACTION_NAME(state, data) {
      state.deployInfo.action = data
    },
    CLEAR_DEPLOY_DATA(state, data) {
      state.deployInfo.projectName = data
      state.deployInfo.dbIp = data
      state.deployInfo.slaveIp = data
      state.deployInfo.dbPort = data
      state.deployInfo.dbPassword = data
      state.deployInfo.gameIp = data
      state.deployInfo.rw = data
      state.deployInfo.frontIp = data
    },
  },
  actions: {}
};

export default deploy

