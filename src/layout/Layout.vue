<template>
  <div>
    <vue-page-transition name="fade-in-right">
      <keep-alive>
        <router-view v-if="this.$route.meta.keepAlive"></router-view>
      </keep-alive>
    </vue-page-transition>
    <router-view v-if="!this.$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {

}
</script>

<style lang="scss" scoped>

</style>
