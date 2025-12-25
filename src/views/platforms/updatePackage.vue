<template>
  <div class="layout">
    <el-card>
      <el-divider><strong><i class="el-icon-platform-eleme"></i>更新内容</strong></el-divider>
      <p>
        <span class="item-name">平台:</span> <el-link type="success" :underline="false">{{ name }}</el-link>
      </p>
      <p>
        <span class="item-name">动作:</span> <el-link type="success" :underline="false">{{ action }}</el-link>
      </p>
      <p>
        <span class="item-name">包名:</span> <el-link type="success" :underline="false">{{ file }}</el-link>
      </p>
      <p>
        <span class="item-name">下载地址:</span> <el-link :href="domain" type="success" :underline="false" target="_blank">{{ domain }}</el-link>
      </p>
    </el-card>
    <el-card class="layout-no" v-loading="loading"
             element-loading-text="拼命更新中"
             element-loading-spinner="el-icon-loading"
             >
      <el-divider><strong><i class="el-icon-message-solid"></i>更新结果</strong></el-divider>
<!--      <div>{{ content }}</div>-->
      <template>
        <div class="format-code">
          <pre>
            <code>{{ content }}</code>
          </pre>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { updatePackage, checkUpdateStatus } from '@/api'
import Nprogress from "nprogress"

export default {
  name: 'updatePackage',
  data () {
    return {
      name: '',
      action: '',
      file: '',
      domain: '',
      content: '',
      status: true,
      count: 0,
      loading: true,
    }
  },
  created() {
    this.name = this.$route.params.name;
    this.action = this.$route.params.title;
    this.file = this.$route.params.file;
    this.cdnDomain(this.name);
    this.updatePackage(this.name, this.file);
  },
  methods: {
    async updatePackage (name, file) {
      Nprogress.start();
      Nprogress.set(0.1);
      await updatePackage({ name: name, file: file }).then(res => {
        if (res.data.status === 666) {
          this.content = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
        this.loading = false;
        Nprogress.done();
      }).catch(() => {
        this.loading = false;
        Nprogress.done();
      })
    },
    cdnDomain (platformName) {
      if (platformName === 'fish') {
        this.domain = `https://${this.$route.params.domain}/game/Resources/fish/${this.file}`
      }
      else if (platformName === 'mhby') {
        this.domain = `https://${this.$route.params.domain}/game/Resources/fish/${this.file}`
      }
      else if (platformName === 'ssbtc') {
        this.domain = `https://${this.$route.params.domain}/game/Resources/ssbtc2021/${this.file}`
      }
      else if (platformName === 'kzdr') {
        this.domain = `https://${this.$route.params.domain}/game/Resources/kzdr/${this.file}`
      }
      else if (platformName === 'bjby') {
        this.domain = `https://${this.$route.params.domain}/game/Resources/fish/${this.file}`
      }
    }
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
  font-size: 17px;
  overflow: auto;
  color: #c3c3c3;
  background-color: #292828;
}
</style>
