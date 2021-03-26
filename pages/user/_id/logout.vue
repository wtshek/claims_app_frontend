<template>
  <b-loading v-model="isLoading" :is-full-page="true"></b-loading>
</template>

<script>
export default {
  name: 'LogoutPage',

  data() {
    return {
      isLoading: true,
    }
  },

  mounted() {
    this.$store.dispatch('user/logout').then(() => {
      this.$router.push('/login')
    })
  },
}
</script>
