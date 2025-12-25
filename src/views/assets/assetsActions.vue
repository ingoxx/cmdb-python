<template>
  <div class="layout">
    <el-card>
      <el-divider><strong><i class="el-icon-s-promotion"></i>更新内容</strong></el-divider>
      <p>
        <span class="item-name"><strong>平台:</strong></span> <el-link type="success" :underline="false">{{ project }}</el-link>
      </p>
      <p>
        <span class="item-name"><strong>ip:</strong></span> <el-link type="success" :underline="false">{{ ip }}</el-link>
      </p>
      <p>
        <span class="item-name"><strong>动作:</strong></span> <el-link type="success" :underline="false">{{ action }}</el-link>
      </p>
    </el-card>
    <el-card class="layout-no" v-loading="loading"
             element-loading-text="拼命更新中"
             element-loading-spinner="el-icon-loading"
             >
      <el-divider><strong><i class="el-icon-s-promotion"></i>脚本输出</strong></el-divider>
      <template>
        <div class="format-code" v-for="(data, index) in content" :key="index">
          <pre><code class="code">{{ data }}</code></pre>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>

import baseUrl from "../../utlis/baseUrl";
import store from '../../store/index'

export default {
  name: 'updateProcess',
  data () {
    return {
      value: "",
      socket: "",
      project: '',
      action: '',
      name: "",
      ip: '',
      allData: "",
      content: [],
      path: '',
      loading: true,
      loadingAllPage: true,
    }
  },
  created() {
    this.project = this.$route.params.project;
    this.action = this.$route.params.action;
    this.ip = this.$route.params.ip;
    this.info = this.$route.params.info
    this.allData = JSON.stringify({
      project: this.project,
      action: this.action,
      ip: this.ip,
      select : 200,
    })
    this.path = `ws://${baseUrl.replace(/http:\/\//, '')}:10086/ws/assets/action/`
    // this.path = `ws://192.168.3.19:10086/ws/assets/action/`
    this.wsInit();
  },
  methods: {
    wsInit () {
      if (typeof(WebSocket) === "undefined") {
          this.$message.error("您的浏览器不支持socket")
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open () {
      // this.$message.success('websocket连接成功')
      this.send()
    },
    error () {
      this.loading = false;
      this.content.push('连接失败');
      this.$message.error('websocket连接失败')
    },
    getMessage (msg) {
      this.loading = false;
      this.content.push(msg.data);
      window.scrollTo(0, document.body.scrollHeight);
    },
    send () {
      this.socket.send(this.allData)
    },
    close () {
     this.$message.warning('websocket连接已关闭')
    },
    runCmd() {
      this.socket.send(this.value)
    },
  }
}
</script>

<style lang="scss" scoped>
.layout > *{
  margin: 5px 0;
}
.layout-no {
  word-break: break-all;
}
.item-name {
  font-size: 13px;
}
#nprogress .bar {

}
.format-code {
  text-align: justify;
  font-size: 15px;
  overflow: auto;
  color: #c3c3c3;
  background-color: #292828;
}
.code {
  float: left;
  margin: 0 12px;
}
</style>
