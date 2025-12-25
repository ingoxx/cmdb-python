<template>
  <div class="el-container-height">
    <el-container>
      <el-aside :width="isCollapse ? '65px' : '209px'">
        <el-menu class="home-container"
               background-color="#304156"
               active-text-color="#ffd04b"
               text-color="rgb(191, 203, 217)"
               :router="true"
               :collapse="isCollapse"
               :collapse-transition="false"
               :default-active="editableTabsValue"
               >
          <!---首页是所有已登录用户都可以访问的页面,所以这里就写死了--->
          <el-menu-item index="/" @click.native="TabsHome('/')">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </template>
          </el-menu-item>
          <template v-for="(item1, index1) in permissionList">
            <el-submenu :index="item1.path" :key="index1">
              <template slot="title">
                <i :class="item1.meta.icon"></i>
                <span slot="title">{{ item1.meta.name }}</span>
              </template>
              <template v-if="item1.children && item1.children.length > 0">
                <template v-for="(item2, index2) in item1.children">
                  <el-menu-item  v-if="item2.hidden"
                            :key="index2"
                            :index="item2.path"
                            :is="'el-menu-item'"
                            @click.native="addTabs(item2.meta.name, item2.path)"
                  >
                    <i :class="item2.meta.icon"></i>{{ item2.meta.name }}
                  </el-menu-item>
                </template>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span :class="isCollapse ? 'iconfont iconindent  iconsize' : 'iconfont iconoutdent iconsize'" @click="toggleHandle"></span>
          <el-breadcrumb separator="/" class="c-el-bread">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in this.$route.meta.title" :key="index">{{ item }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon008-saving"></use>
              </svg>
              {{ user }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="drop-min-width">
              <el-dropdown-item @click.native="UserDetail">个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-tabs v-model="editableTabsValue" type="card" @tab-click="tabChange" @tab-remove="removeTab">
          <el-tab-pane label="首页" name="/" :closable="false"></el-tab-pane>
          <el-tab-pane
            :closable="true"
            v-for="item in editableTabs"
            :key="item.path"
            :label="item.title"
            :name="item.path"
          >
          </el-tab-pane>
        </el-tabs>
        <el-main>
          <vue-page-transition name="fade-in-right">
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
          </vue-page-transition>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="个人中心"
      :visible.sync="userCenter"
      width="62%"
      :center="true"
      >
      <el-divider></el-divider>
      <userCenter></userCenter>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { userDetail } from '@/api'
import userCenter from '../views/users/UserDetail'
import store from '../store/index'


export default {
  name: 'Home',
  inject:['reload'],
  data () {
    return {
      userCenter: false,
      isCollapse: false,
      user: '',
      editableTabs: [],
      activeName: 'second',
      editableTabsValue: ''
    }
  },
  computed: {
    ...mapState({
      'permissionList': state => state.addRouters.permissionList,
      'userDetail': state => state.detail.userDetails
    })
  },
  components : {
    userCenter
  },
  beforeMount() {
    store.dispatch("getUserDetail")
  },
  mounted () {
    if (this.$route.meta.name !== '首页') {
      this.editableTabs.push({
        title: this.$route.meta.name,
        path: this.$route.path
      });
    }
    this.editableTabsValue = this.$route.path;
    this.user = window.sessionStorage.getItem('user');
  },
  methods: {
    toggleHandle () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      // 退出清空token,权限缓存
      sessionStorage.clear();
      this.$store.commit('CLEAR_PERMISSION', null);
      this.$router.replace('/login')
    },
    addTabs (title, path) {
      let data = {title, path};
      let tabs = this.editableTabs.filter(item => item.title === data.title);
      if (tabs.length === 0) {
        this.editableTabs.push(data);
      }
      this.editableTabsValue = data.path;
    },
    tabChange(tab) {
      this.$router.replace(tab.name,
      onComplete => {},
            onAbort => {}
      )
    },
    removeTab (targetName) {
      let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.path === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.path;
              } else {
                activeName = '/index';
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.path !== targetName);
        this.$router.replace(this.editableTabsValue,
          onComplete => {},
            onAbort => {});
      },
    TabsHome (path) {
      this.editableTabsValue = path
    },
    async UserDetail () {
      this.userCenter = true;
    },
  }
}
</script>

<style lang="scss" scoped>
.el-container-height {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  line-height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.el-header > * {
  display: flex;
  float: left;
}
.el-aside {
  background-color: #545c64;
  text-align: left;
}
.el-menu {
  width: 202px;
  height: 100%;
}
::v-deep .el-breadcrumb {
  line-height: 60px;
  padding: 0 20px;
}
.el-dropdown {
  float: right;
  margin: 0 24px;
  font-size: 16px;
}
.iconsize {
  font-size: 22px;
  cursor: pointer;
}
.el-main {
  overflow: hidden;
  overflow-y: auto;
}
.menus-tabs > * {
  margin: 0 5px;
}
.menus-tabs {
  line-height: 40px;
  border-bottom: 1px solid #f2f0f0;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-arrow-down {
  font-size: 12px;
}
.user-img {
  width: 59px;
  height: 59px;
}
.icon {
  position: relative;
  height: 41px;
  width: 40px;
  margin: 0 13px;
  top: 12px;
  background-color: #00BCD4;
  border-radius: 11px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.drop-min-width {
  min-width: 98px;
}
</style>
