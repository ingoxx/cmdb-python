<template>
  <div class="block">
  <div class="radio">
    排序：
    <el-radio-group v-model="reverse">
      <el-radio :label="true">倒序</el-radio>
      <el-radio :label="false">正序</el-radio>
    </el-radio-group>
  </div>

  <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
</div>
</template>

<script>
export default {
  data() {
      return {
        reverse: false,
        activities: [{
          content: '开始学习vue',
          timestamp: '2021-03-19'
        }, {
          content: '开始独立编写项目',
          timestamp: '2021-04-28'
        }, {
          content: '独立完成,完善cmdb',
          timestamp: '2021-05-13-至今'
        }]
      };
    }
}

</script>

<style lang="scss" scoped>
.radio {
  margin-bottom: 20px;
}
</style>
