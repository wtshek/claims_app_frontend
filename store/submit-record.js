import localforage from 'localforage'
import { flattenObject } from '../utils/utils'
import { defaultType } from '~/utils/constant'

// use method avoid mutation
const recordOnPTType = (type = defaultType) => {
  if (type === 'bus' || type === 'minibus' || type === 'ferry') {
    return {
      routeIndex: -1,
      onboardStopId: null,
      alightStopId: null,
      bounds: 'inbound',
      typeOfPT: type,
      routeName: '',
    }
  } else if (
    type === 'mtr_lines' ||
    type === 'airport_express' ||
    type === 'light_rail'
  ) {
    return {
      onboardStopId: null,
      alightStopId: null,
      typeOfPT: type,
    }
  } else if (type === 'tram') {
    return {
      typeOfPT: type,
    }
  }
}

const recordCommon = (typeOf) => ({
  fare: '',
  date: new Date(),
})

const getDefaultRecordState = (typeOfPT = defaultType) => {
  return { ...recordCommon(), ...recordOnPTType(typeOfPT) }
}

export const state = () => ({
  tabs: {},
  record: { ...getDefaultRecordState() },
})

export const mutations = {
  setTabs(state, val) {
    state.tabs = val
  },
  setRecord(state, info) {
    state.record = { ...state.record, ...info }
  },
  resetRecord(state, typeOfPT) {
    const newRecord = getDefaultRecordState(typeOfPT || state.record.typeOfPT)
    state.record = {
      ...newRecord,
      date: state.record.date,
      status: state.record.status,
    } // status unchange
  },
}

export const actions = {
  async getTabs({ commit }) {
    const tabs = await localforage.getItem('tabs')
    commit('setTabs', tabs)
  },

  getTramFare({ commit, rootState }) {
    const { routes } = rootState.db.PTData

    const filteredRoutes = Object.values(routes).filter(
      (route) => route.type === 'tram'
    )
    const obj = flattenObject(filteredRoutes[0].charts)
    const fare = Object.values(obj)[2]

    commit('setRecord', { fare })
  },
  resetAllState({ commit }) {
    commit('resetRecord')
    commit('bus/resetState', null, { root: true })
  },
}
