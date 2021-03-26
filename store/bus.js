import localforage from 'localforage'
import { flattenObject } from '../utils/utils'
import { getEffectiveChart } from '../utils/sumbitRecord'
/**
 * record structure for bus
 * {
 * routeIndex
 * onboardStopId
 * alightStopId
 * fare
 * }
 */

const stopIDsRegex = /(?<=\d+:).*/

const getDefaultState = () => ({
  routeNames: [],
  alightStops: [],
  onboardStops: [],
  routeName: '',
  lang: '',
  fares: [],
})

export const state = () => getDefaultState()

export const mutations = {
  setRouteNames(state, val) {
    state.routeNames = val
  },
  setLang(state, lang) {
    state.lang = lang
  },
  resetAlightStops(state) {
    state.alightStops = []
  },
  resetOnboardStops(state) {
    state.onboardStops = []
  },
  setOnboardStops(state, { charts, stops, lang }) {
    // find the index in the key
    const onBoardStopsIndex = Object.entries(charts).map(([key, val]) => {
      return [key.match(stopIDsRegex)[0], val]
    })

    const editedStops = onBoardStopsIndex.map(([index, val]) => {
      const stop = stops[index]
      const fares = Object.values(val)
      const fare = fares[fares.length - 1]
      const name = `${stop.locales[lang].name}` + ` ($${fare})`

      return { ...stop, name }
    })
    state.onboardStops = editedStops
  },

  setAlightStops(state, { charts, stops, lang }) {
    const alightStops = Object.entries(charts).map(([key, val]) => {
      const id = key.match(stopIDsRegex)
      const stop = stops[id]
      const name = `${stop.locales[lang].name} ($${val})`
      return { ...stop, name }
    })
    state.alightStops = alightStops
  },
  setRouteName(state, val) {
    state.routeName = val
  },
  resetState(state) {
    state.routeName = ''
    state.alightStops = []
    state.onboardStops = []
  },
}

export const actions = {
  async onCreated({ commit, rootState }, type) {
    const lang = rootState.user.lang
    const routeNames = await localforage.getItem(lang)
    commit('setRouteNames', routeNames['routes-locale'][type])

    commit('setLang', rootState.user.lang)
  },

  getRouteName({ commit, rootState, dispatch }) {
    const { routeIndex, bounds } = rootState['submit-record'].record
    console.log(routeIndex)
    const { lang } = rootState.user
    if (!routeIndex || routeIndex === -1) return ''
    // just in case route doesn't exist
    const routeInfo = rootState.db.PTData.routes[routeIndex]

    const {
      name,
      origin_name: originName,
      destination_name: destinationName,
    } = routeInfo.locales[lang]

    const routeName = `${name} to ${
      bounds === 'inbound' ? destinationName : originName
    }`

    commit('setRouteName', routeName)
  },

  getOnboardStops({ commit, rootState, state }) {
    const { stops, routes } = rootState.db.PTData
    const { lang } = rootState.user
    const { bounds, routeIndex } = rootState['submit-record'].record

    if (!routeIndex || routeIndex === -1) return
    const routeInfo = routes[routeIndex]
    const charts = Object.values(routeInfo.charts)[0].bounds[bounds]
    const x = Object.values(charts) // first layer
    const y = Object.values(x) // second layer

    if (x.length === 1 && y.length === 1) {
      commit(
        'submit-record/setRecord',
        { fare: Object.values(y[0])[0] },
        {
          root: true,
        }
      )
    }
    commit('setOnboardStops', { charts, stops, lang })
  },

  getAlightStops({ commit, state, rootState }) {
    const { routeIndex, bounds, onboardStopId } = rootState[
      'submit-record'
    ].record
    const { stops, routes } = rootState.db.PTData

    if (!routeIndex || routeIndex === -1) return

    const routeInfo = routes[routeIndex]

    const charts = Object.values(routeInfo.charts)[0].bounds[bounds]

    const onboardStopKey = Object.keys(charts).find((key) => {
      return key.includes(String(onboardStopId))
    })

    if (!onboardStopKey) return

    return commit('setAlightStops', {
      charts: charts[onboardStopKey],
      stops,
      lang: rootState.user.lang,
    })
  },

  getFare({ commit, rootState }) {
    const { routeIndex, onboardStopId, bounds, alightStopId, date } = rootState[
      'submit-record'
    ].record
    const { routes } = rootState.db.PTData
    const routeInfo = routes[routeIndex]

    if (!routeIndex || !alightStopId || !onboardStopId) return

    const effectiveChart = getEffectiveChart(
      Object.values(routeInfo.charts),
      date
    )

    const charts = flattenObject(effectiveChart)

    const regex =
      `bounds.` + bounds + `.\\w+:` + onboardStopId + '.\\w+:' + alightStopId

    const chartKey = Object.keys(charts).filter((key) => {
      return key.match(new RegExp(regex))
    })

    const mappedFare = charts[chartKey[0]]
    commit('submit-record/setRecord', { fare: mappedFare }, { root: true })
  },
  resetRoute({ commit, rootState }) {
    // unknown bug, need to reset them separately
    commit('resetAlightStops')
    commit('resetOnboardStops', {})
    commit('resetState')
    commit(
      'submit-record/setRecord',
      {
        fare: '',
        alightStopId: '',
        onboardStopId: '',
        routeInfo: {},
        routeIndex: '',
      },
      { root: true }
    )
  },
}
