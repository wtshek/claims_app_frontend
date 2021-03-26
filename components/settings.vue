<template>
  <section>
    <b-field :label="$t('settings.language')">
      <b-select v-model="computedLang" @input="onSaveEnabled()">
        <option
          v-for="option in languages"
          :key="option.val"
          :value="option.val"
        >
          {{ $t(`languages.${option.val}`) }}
        </option>
      </b-select>
    </b-field>
    <b-button type="is-primary" :disabled="disabled" @click="onSaveClick()">{{
      $t('save')
    }}</b-button>
    <b-field :label="$t('settings.logout_label')" class="logout">
      <b-button
        class="logout-bt button"
        type="is-primary"
        outlined
        @click="onLogout"
      >
        {{ $t('nav.logout') }}
      </b-button>
    </b-field>
  </section>
</template>
<script>
export default {
  name: 'Settings',
  props: {
    // TODO: connect to logout from parent func
    onLogout: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      languages: [
        { label: 'English', val: 'en' },
        { label: 'Chinese(Simplified)', val: 'zh-hans' },
        { label: 'Chinese(traditional)', val: 'zh-hant' },
      ],
      disabled: true,
      lang: '',
    }
  },
  computed: {
    computedLang: {
      get() {
        return this.$store.state.user.lang
      },
      set(newVal) {
        return (this.lang = newVal)
      },
    },
  },
  methods: {
    onSaveEnabled() {
      this.disabled = false
    },
    onSaveClick() {
      this.$store.dispatch('user/changeLang', this.lang)
      window.location.reload(true)
    },
  },
}
</script>
<style lang="scss" scoped>
.logout {
  display: block;
  margin-top: 50px;
}
</style>
