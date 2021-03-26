import localforage from 'localforage'
import { user } from '../utils/localForageInstance'

// import _ from 'lodash'
import { getLang } from '../utils/utils'

export const state = () => ({
  PTData: [],
  typeIndex: {},
  stops: {},
  routesLocale: [],
  getStopName(index) {
    if (typeof PTData === 'object' && Object.keys(this.PTData).length > 0) {
      return this.PTData[index].locales[getLang()].name
    }
  },
})

export const mutations = {
  initDBStore(state, data) {
    const { ptData, typeIndex, stops, routesLocale } = data
    // state = { ...state, PTData: ptData, typeIndex, stops, routesLocale }
    state.PTData = ptData
    state.typeIndex = typeIndex
    state.stops = stops
    state.routesLocale = routesLocale
  },
}

export const actions = {
  async init({ commit, rootState }) {
    const ptData = await localforage.getItem('pt-data')
    const ptTypeIndexes = await localforage.getItem('routeIndex')
    const langData = await localforage.getItem(rootState.user.lang)
    const routesLocale = langData['routes-locale']
    const stops = ptData.stops

    commit('initDBStore', {
      ptData,
      typeIndex: ptTypeIndexes,
      stops,
      routesLocale,
    })
    return true
  },

  async update(context, data) {
    await user.setItem('last_update', new Date())
  },
}
