<template>
  <div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$message.warning('权限不足,不要乱来,将强制退出！！！！！');
      setTimeout(() => {
        sessionStorage.clear();
        this.$store.commit('CLEAR_PERMISSION', null);
        this.$store.commit('CLEAR_DETAIL', null);
        this.$store.commit('CLEAR_TABS', null);
        this.$router.replace('/login');
      }, 2000)
    }
  }
</script>
