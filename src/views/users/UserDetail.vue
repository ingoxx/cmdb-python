<template>
  <div class="user-center">
    <el-card class="card-el">
      <div class="user-info"><h3>个人信息</h3></div>
      <el-divider></el-divider>
      <div class="user-info">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon008-saving"></use>
        </svg>
        <p class="size"><strong>{{ userDetails.groups.name }}</strong></p>
      </div>
      <el-divider>
        <strong><i class="el-icon-user"></i>姓名</strong>
      </el-divider>
      <div class="user-info">
        <el-link :underline="false" type="success">{{ userDetails.username }}</el-link>
      </div>
      <el-divider><strong><i class="el-icon-edit-outline"></i>邮箱</strong></el-divider>
      <div class="user-info">
        <el-link :underline="false" type="success">{{ userDetails.email }}</el-link>
      </div>
      <el-divider><strong><i class="el-icon-sunrise-1"></i>状态</strong></el-divider>
      <div class="user-info">
        <el-link :underline="false" type="success" v-text="userDetails.is_active ? '正常' : '异常'"></el-link>
      </div>
      <el-divider><strong><i class="el-icon-timer"></i>添加时间</strong></el-divider>
      <div class="user-info">
        <el-link :underline="false" type="success">{{ userDetails.date_joined }}</el-link>
      </div>
      <el-divider><strong><i class="el-icon-guide"></i>标签</strong></el-divider>
      <div class="user-info">
        <el-tag class="tag-null">python</el-tag>
        <el-tag class="tag-null">django</el-tag>
        <el-tag class="tag-null">vue</el-tag>
      </div>
    </el-card>
    <el-card class="card-el">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="修改密码" name="first">
            <detail></detail>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import detail from './detail/Detail'
// import DevelopHistory from './history/DevelopHistory'


export default {
  name: 'UserDetail',
  data () {
    return {
      activeName: 'first',
    }
  },
  components: {
    detail,
    // DevelopHistory
  },
  computed: {
    ...mapState({
      'userDetails': state => state.detail.userDetails
    })
  },
  mounted () {
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  display: flex;
}
.user-info {
  text-align: center;
}
.card-el {
  margin: auto 15px;
  width: 50%;
}
.icon {
  position: relative;
  height: 79px;
  width: 80px;
  margin: 0 13px;
  background-color: #00BCD4;
  border-radius: 40px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.size {
  color: #6bb5f0;
}
.button-el {
  text-align: center;
}
.tag-null {
  margin: auto 15px;
}
</style>
