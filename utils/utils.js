import localforage from 'localforage'

export const getLang = (lang) => {
  if (lang.includes('zh')) {
    return lang === 'zh-CN' || lang === 'zh-hans' ? 'zh-hans' : 'zh-hant'
  }
  return 'en'
}

export function flattenObject(ob = {}) {
  const toReturn = {}

  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue

    if (typeof ob[i] === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i])
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue

        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}

export const generateRouteNames = (store, data, i18nTo) => {
  let title
  const to = i18nTo || ' to '
  const { db, user } = store.state
  const lang = user.lang
  const { routes, stops } = db.PTData

  if (!stops || !routes) return

  const { typeOfPT, onboardStopId, alightStopId } = data
  if (
    typeOfPT === 'mtr_lines' ||
    typeOfPT === 'airport_express' ||
    typeOfPT === 'light_rail' ||
    typeOfPT === 'ferry'
  ) {
    const onboardStop = stops[onboardStopId].locales[lang].name
    const alightStop = stops[alightStopId].locales[lang].name

    title = onboardStop + to + alightStop
    return title
  }

  if (typeOfPT === 'bus' || typeOfPT === 'minibus') {
    const { routeIndex, bounds } = data
    const route = routes[routeIndex]
    const {
      name,
      origin_name: originName,
      destination_name: destinationName,
    } = route.locales[lang]
    title = name
    bounds === 'inbound'
      ? (title += ` ${to} ${destinationName}`)
      : (title += ` ${to} ${originName}`)

    return title
  }
}

export const isDatabaseReady = async () => {
  const data = await localforage.getItem('pt-data')
  const en = await localforage.getItem('en')
  const zhHans = await localforage.getItem('zh-hans')
  const zhHant = await localforage.getItem('zh-hant')
  const tabs = await localforage.getItem('tabs')

  return data || en || zhHans || zhHant || tabs
}
