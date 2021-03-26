// import axios from 'axios'
import api from '../config/api'
import { getLang } from '../utils/utils'
import { user } from '../utils/localForageInstance'
import { jwt } from '../utils/constant'

const favRoutes = 'favRoutes'
// const baseInfo = 'baseInfo'
const isOnline = false

export const state = () => ({
  // jwt: undefined,
  baseInfo: {
    _id: '',
    name: '',
    gender: '',
    email: '',
    phoneL: '',
    registered: '',
  },
  favRoutes: [],
  lang: '',
  goTour: false,
})

export const mutations = {
  signUp() {
    // logic goes here
  },

  // ============================
  // User Info Related Mutations
  // =============================

  setUserInfoState(state, data) {
    state.baseInfo = data
  },

  // ============================
  // Route Related Mutation
  // =============================

  setFavRoutesState(state, routes) {
    state.favRoutes = routes
  },
  setLang(state, lang) {
    state.lang = getLang(lang)
  },
  goTour(state) {
    state.goTour = true
  },
}

export const actions = {
  async login({ state, commit }, info) {
    const res = await this.$axios.$post(api.login(), info)
    if (res.jwt) {
      await user.setItem(jwt, res.jwt)
    }
    return res
  },

  async signUp({ state, commit }, info) {
    const res = await this.$axios.$post(api.signUp(), info)
    if (res.jwt) {
      await user.setItem(jwt, res.jwt)
    }
    return res
  },

  async logout(context) {
    // const res = await axios.post('', { email, password })
    if (!process.browser) return ''
    try {
      await user.removeItem(jwt)
      return 'logout successfully'
    } catch (err) {
      return err
    }
  },

  // ============================
  // User Info Related Actions
  // =============================

  getUserInfo({ commit }) {
    if (isOnline) {
    }
  },
  async editUserProfil({ commit }) {},

  async onLogout({ commit }) {},

  // ============================
  // Route Related Actions
  // =============================

  async saveFavRoute({ state, commit }, route) {
    try {
      const routes = await user.getItem(favRoutes)
      route._id = routes ? routes.length + 1 : 0
      await user.setItem(favRoutes, routes ? [...routes, route] : [route])
    } catch (err) {
      return new Error(err)
    }
  },

  async getFavRoutes({ commit }) {
    try {
      const routes = await user.getItem(favRoutes)
      commit('setFavRoutesState', routes || [])
    } catch (err) {
      return new Error(err)
    }
  },

  async delFavRoute({ commit }, id) {
    try {
      const routes = await user.getItem(favRoutes)
      const filteredRoutes = routes.filter((route) => route._id !== id)
      await user.setItem(favRoutes, filteredRoutes)
      commit('setFavRoutesState', filteredRoutes)
    } catch (error) {
      console.log(error)
    }
  },

  async changeLang({ commit }, lang) {
    await user.setItem('lang', lang)
    commit('setLang', lang)
  },
  async savedRouteFreqIncrease({ commit }, _id) {
    const routes = await user.getItem(favRoutes)
    const newRoutes = routes.map((route) => {
      if (route._id === _id) route.frequency += 1
      return route
    })

    commit('setFavRoutesState', routes)

    await user.setItem(favRoutes, newRoutes)
  },
}
