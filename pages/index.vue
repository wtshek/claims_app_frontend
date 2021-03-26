<template>
  <b-loading v-model="isLoading" :is-full-page="true"></b-loading>
</template>

<script>
export default {
  name: 'HomePage',
  middleware: ['auth'],
  data() {
    return {
      isLoading: true,
    }
  },
}
</script>
