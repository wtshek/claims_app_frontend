export const state = () => ({
  message: '',
  show: false,
})

export const mutations = {
  showNotification(state, message) {
    state.show = true
    state.message = message
  },
  closeNofication(state) {
    state.show = false
  },
}

export const actions = {}
