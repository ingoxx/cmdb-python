const menuTabs = {
    namespace: true,
    state: {
        menuTabList: [],
    },
    getters: {
    },
    mutations: {
        UPDATE_TABS(state, data){
            state.menuTabList = data;
            window.sessionStorage.setItem('menuTabList', JSON.stringify(data));
        },
        CLEAR_TABS(state, data){
            state.menuTabList = data;
            window.sessionStorage.setItem('menuTabList', JSON.stringify(data));
        },
    },
    actions: {
    },
}

export default menuTabs
    

