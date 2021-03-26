export const state = () => ({
  synced: false,
  notiBoxMsg: '',
})

export const mutations = {
  turnOffSync(state) {
    state.synced = true
  },
  setNotiBoxMsg(state, msg) {
    state.notiBoxMsg = msg
  },
}
