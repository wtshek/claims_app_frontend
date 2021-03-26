<template>
  <div class="msg">{{ msg }}</div>
</template>
<script>
export default {
  name: 'ErrorMsg',
  props: ['msg'],
}
</script>
<style lang="scss" scoped>
.msg {
  color: #b22222;
  font-style: italic;
}
</style>
