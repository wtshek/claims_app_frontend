import localforage from 'localforage'
import { user } from '../utils/localForageInstance'
import { getLang, isDatabaseReady } from '../utils/utils'
const langs = ['en', 'zh-hans', 'zh-hant'] // according to the key in database

const generateTabs = (ptData) => {
  const tabs = {}

  const railwayKeys = Object.keys(ptData.railway_charts)

  railwayKeys.forEach((item) => {
    tabs[item] = item
  })

  const routes = ptData.routes

  for (const index in routes) {
    tabs[routes[index].type] = routes[index].type
  }

  return tabs
}

const generateLocales = async (data, obj) => {
  const lang = await user.getItem('lang') // store lang according to browser naming
  const langKey = getLang(lang) // lang according to database
  let stringTo
  const night = ' 🌛 '
  let special
  switch (langKey) {
    case 'zh-hant':
      stringTo = ' 往 '
      special = ' (特別班次)'
      break

    case 'zh-hans':
      stringTo = ' 往 '
      special = ' (特別班次)'
      break

    default:
      stringTo = ' to '
      special = ' (special departures)'
  }

  data.forEach((item, index) => {
    const {
      locales,
      operating_hours: operatingHours,
      direction,
      special_departures: specialDepartures,
      deleted,
      // special_departures: specialDepartures,
    } = item

    if (deleted) return

    const bounds = Object.values(item.charts)[0].bounds
    const type = item.type
    const key = item.key

    Object.keys(locales).forEach((locale) => {
      // check if the corresponding lang made or not
      if (!obj[locale]) obj[locale] = []
      const {
        name,
        destination_name: destinationName,
        origin_name: originName,
      } = locales[locale]

      let inbound, outbound
      if (type === 'bus' || type === 'minibus') {
        if (direction === 'circular') {
          inbound = name + ' ' + originName + ' ↻ ' + destinationName
        } else {
          inbound = name + stringTo + destinationName
        }
        // if there is outbound
        outbound =
          Object.keys(bounds).length > 1
            ? name + stringTo + originName
            : undefined
      } else {
        inbound = originName + ' - ' + destinationName

        // if there is outbound
        outbound =
          Object.keys(bounds).length > 1
            ? destinationName + ' - ' + originName
            : undefined
      }

      if (operatingHours === 'night') {
        inbound += night
        if (outbound) outbound += night
      }

      if (specialDepartures === '1') {
        inbound += special
        if (outbound) outbound += special
      }

      obj[locale][type].push({ key, inbound: true, name: inbound })
      if (outbound)
        obj[locale][type].push({
          key,
          inbound: false,
          name: outbound,
        })
    })
  })

  return obj
}

const addKeyToObj = (objs) => {
  const keys = Object.keys(objs)

  keys.forEach((key) => {
    const obj = objs[key]
    obj.key = key
  })

  return objs
}

const prepareDBStore = (context) => async (data) => {
  const ptData = await localforage.getItem('pt-data')
  const storedTabs = await localforage.getItem('tabs')
  const routeIndex = await localforage.getItem('route-index')

  if (ptData && storedTabs && routeIndex) return ''

  // start database processing

  const tabs = await generateTabs(data)
  addKeyToObj(data.routes)
  addKeyToObj(data.stops)

  const emptyObj = {}
  for (const lang of langs) {
    emptyObj[lang] = {}
    for (const tab of Object.keys(tabs)) {
      emptyObj[lang][tab] = []
    }
  }

  const locales = await generateLocales(Object.values(data.routes), emptyObj)

  await localforage.setItem('pt-data', data)
  langs.forEach((lang) => {
    localforage.setItem(lang, { 'routes-locale': locales[lang] })
  })

  localforage.setItem('tabs', tabs)
  localforage.setItem('updated-at', new Date())

  context.store.dispatch('db/init')
}

async function prepareStore(context) {
  // user store
  const savedLang = await user.getItem('lang')

  const lang = savedLang || navigator.language
  context.store.commit('user/setLang', lang)

  if (!savedLang) await user.setItem('lang', lang)

  // db store
  const isReady = await isDatabaseReady()
  if (isReady) {
    context.store.dispatch('db/init')
  }
}

export default function (context, inject) {
  prepareStore(context)
  inject('initDB', (data) => prepareDBStore(context)(data))
}
