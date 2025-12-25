<template>
  <el-card class="box-card">
    <el-calendar v-model="value">
    </el-calendar>
  </el-card>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      value: new Date()
    }
  }
}
</script>
