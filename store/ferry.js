import { flattenObject } from '../utils/utils'
import { getEffectiveChart } from '../utils/sumbitRecord'
/**
 * record structure
 * {
 * onboardStopId,
 * alightStopId,
 * bounds,
 * fare,
 * routeIndex
 * }
 */

export const state = () => ({
  stops: [],
  routes: [],
  reducedRoutes: [],
  alightStops: [],
})

export const mutations = {
  setStops(state, arr) {
    state.stops = arr
  },
  setReducedRoutes(state, arr) {
    state.reducedRoutes = arr
  },
  setAlightStops(state, arr) {
    state.alightStops = arr
  },
}

export const actions = {
  getStops({ commit, rootState }) {
    const lang = rootState.user.lang
    const { stops } = rootState.db.PTData

    const filteredStops = Object.values(stops).filter(
      (stop) => stop.type === 'ferry'
    )
    const mappedStops = filteredStops.map((stop) => ({
      name: stop.locales[lang].name,
      key: stop.key,
    }))
    commit('setStops', mappedStops)
  },
  getAlightStops({ commit, rootState, dispatch }) {
    const { routes, stops } = rootState.db.PTData
    const { lang } = rootState.user
    const { onboardStopId } = rootState['submit-record'].record
    const filterRoutes = Object.values(routes).reduce((acc, route) => {
      if (route.type === 'ferry') {
        const flattenedCharts = flattenObject(
          Object.values(route.charts)[0].bounds
        )
        const chartKeys = Object.keys(flattenedCharts)
        for (const x of chartKeys) {
          if (x.includes(onboardStopId)) {
            acc.push(route)
            break
          }
        }
      }
      return acc
    }, [])
    // save routes for later convenience
    commit('setReducedRoutes', filterRoutes)

    const ids = []

    const regex = new RegExp(`.+:${onboardStopId}\\.\\d?:([0-9]+$)`)

    filterRoutes.forEach((route) => {
      const charts = Object.values(route.charts)[0]
      const flattenedCharts = flattenObject(charts)
      Object.keys(flattenedCharts).forEach((k) => {
        if (k.match(regex)) {
          const match = k.match(regex)
          ids.push(match[1])
        }
      })
    })

    const alightStops = ids.map((id) => ({
      name: stops[id].locales[lang].name,
      key: id,
    }))
    if (alightStops.length === 1) {
      commit(
        'submit-record/setRecord',
        { alightStopId: alightStops[0].key },
        { root: true }
      )
      dispatch('ferry/getFare', null, { root: true })
    }
    commit('setAlightStops', alightStops)
  },

  getFare({ state, rootState, commit }) {
    const { onboardStopId, date, alightStopId } = rootState[
      'submit-record'
    ].record
    const { reducedRoutes } = state

    const regex = new RegExp(`.:${onboardStopId}.\\d+:${alightStopId}`)

    for (const route of reducedRoutes) {
      const charts = Object.values(route.charts)
      const fares = getEffectiveChart(charts, date)
      const flattened = flattenObject(Object.values(fares))
      for (const k of Object.keys(flattened)) {
        if (k.match(regex)) {
          const fare = flattened[k]
          const bounds = k.includes('inbounds') ? 'inbound' : 'outbound'
          console.log(route)
          commit(
            'submit-record/setRecord',
            { fare, routeIndex: route.key, alightStopId, bounds },
            { root: true }
          )
          break
        }
      }
    }
  },
}
