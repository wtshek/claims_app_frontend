/**
 * record structure for bus
 * {
 * routeInfo: contains all of selected route
 * onboardStopId
 * alightStopId
 * fare
 * }
 */

import { getEffectiveChart } from '../utils/sumbitRecord'

export const state = () => ({
  stops: [],
})

export const mutations = {
  setStops(state, val) {
    state.stops = val
  },
  setOnboardStop(state, val) {
    state.onboard = val
  },
}

export const actions = {
  getStops({ commit, rootState }, type) {
    const { stops } = rootState.db
    const { lang } = rootState.user

    const filteredStops = Object.values(stops).filter(
      (stop) => stop.type === type && !stop.deleted
    )

    const mappedStops = filteredStops.map((stop) => {
      return { name: stop.locales[lang].name, key: stop.key }
    })

    commit('setStops', mappedStops)
  },

  getFare({ commit, rootState }) {
    const { onboardStopId, typeOfPT, alightStopId, date } = rootState[
      'submit-record'
    ].record

    if (onboardStopId && typeOfPT && alightStopId) {
      const charts = rootState.db.PTData.railway_charts

      const effectiveChart = getEffectiveChart(
        Object.values(charts[typeOfPT]),
        date
      )

      const fare = effectiveChart.fares[onboardStopId][alightStopId]
      commit('submit-record/setRecord', { fare }, { root: true })
    }
  },

  resetRecord({ commit }) {
    commit(
      'submit-record/setRecord',
      {
        fare: '',
        onboardStopId: '',
        alightStopId: '',
      },
      { root: true }
    )
  },
}
