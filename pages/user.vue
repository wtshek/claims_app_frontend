<template>
  <div>
    <client-only>
      <div id="menu">
        <Navigation />
      </div>
    </client-only>
    <div id="panel">
      <div class="page-content">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'User',
  middleware: ['auth'],
  components: {
    navigation: () => import('../components/navigation.vue'),
  },
  computed: {},
}
</script>
<style scoped lang="scss">
.open-bt {
  margin-top: 5px;
}

.func-bt {
  border-width: 4px;
  position: fixed;
  right: $shortcutBtRight;
  bottom: $shortcutBtBottom;
  width: min(13vw, 55px);
  height: min(13vw, 55px);
  border-radius: 50%;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  -moz-box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  display: flex;
  justify-content: center;
  background: $primary;

  &.inverted {
    background: #ffffff;
  }

  svg {
    width: 70%;
    height: 100%;
  }
}

.page-content {
  margin: 20px $mobile-page-margin;
}

@media screen and (min-width: $desktop) {
  .create-record-bt {
    display: none;
  }

  .page-content {
    margin: 20px 25vw;
  }
}
</style>
