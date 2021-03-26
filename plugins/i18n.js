import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { user } from '../utils/localForageInstance'
Vue.use(VueI18n)

const initI18n = async ({ app, store }) => {
  const lang = await user.getItem('lang')
  app.i18n = new VueI18n({
    // construction a new VueI18n
    locale: lang,
    fallbackLocale: 'zh-hant',
    messages: {
      // 'locales' directory contains all the translations in the form of json files
      en: require('~/static/locales/en.json'),
      'zh-hans': require('~/static/locales/zh-hans.json'),
      'zh-hant': require('~/static/locales/zh-hant.json'),
    },
  })
}

export default initI18n
