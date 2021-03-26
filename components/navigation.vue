<template>
  <div>
    <div class="header">
      <div class="func-bt">
        <BackArrowSVG
          v-if="nextPage !== defaultLanding.label"
          @click="onBackClick"
        />
      </div>
      <div class="page-name">{{ $t(`nav.${nextPage}`) }}</div>
      <div class="func-bt" @click="onHeaderIconClick">
        <ConfigSVG v-if="cog" />
      </div>
    </div>

    <b-navbar spaced class="desktop-menu">
      <template slot="end">
        <b-navbar-item
          v-for="link in links"
          :key="link.label"
          :href="link.route"
        >
          {{ $t(`nav.${link.label}`) }}
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
import { nav, profile, defaultLanding } from '../config/routes'
import ConfigSVG from '../assets/svg/configuration.svg?inline'
import BackArrowSVG from '../assets/svg/back-arrow.svg?inline'

export default {
  name: 'Navigation',
  components: { ConfigSVG, BackArrowSVG },
  data() {
    return {
      links: nav,
      open: false,
      defaultLanding,
    }
  },

  computed: {
    nextPage() {
      const path = this.$route.path
      let index
      for (let i = 0; i < nav.length; i++) {
        if (path === nav[i].route) index = i
      }
      return nav[index].label
    },

    cog() {
      return this.$nuxt.$route.path === defaultLanding.route
    },
  },

  methods: {
    onHeaderIconClick() {
      const route =
        this.$nuxt.$route.path === profile.route ? '/' : profile.route
      this.$router.push(route)
    },
    onBackClick() {
      this.$nuxt.$router.push('/')
    },
  },
}
</script>

<style scoped lang="scss">
.desktop-menu {
  background: $primary;
  font-size: max(18px, 1.2vw);
  * {
    color: $primary-invert;
  }
}

.background {
  z-index: 1;
  background: #00000075;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.header {
  display: flex;
  column-gap: 15px;
  padding: 20px $mobile-page-margin;
  background-color: $primary;
  justify-content: space-between;
  align-items: center;
  max-height: 70px;

  @media screen and (min-width: 1024px) {
    display: none;
  }

  svg {
    width: min(10vw, 23px);
    height: 25px;
  }
}

.button.is-primary:hover {
  background: $primary;
}

.page-name {
  font-size: max(min(26px, 9vw), 16px);
  font-weight: 700;
  margin-top: -5px;
  color: $primary-invert;

  @media screen and (max-width: 321px) {
    font-size: 22px;
  }
}

.func-bt {
  min-width: 23px;
}

/* toggle two menu */
@media screen and (max-width: $desktop) {
  nav {
    display: none;
  }
}

@media screen and (min-width: $desktop) {
  .mobile-menu,
  .background {
    display: none;
  }

  nav {
    display: block;
  }
}
</style>
