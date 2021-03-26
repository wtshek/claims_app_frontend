import Vue from 'vue'
import VueTour from 'vue-tour'
import { user } from '../utils/localForageInstance'

require('vue-tour/dist/vue-tour.css')

async function newRegister(context) {
  const registered = await user.getItem('registered')
  if (!registered) {
    await user.setItem('registered', true)
    context.store.commit('user/goTour')
  }
}

export default function (context) {
  Vue.use(VueTour)
  newRegister(context)
}
