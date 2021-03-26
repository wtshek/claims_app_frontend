import { user } from '../utils/localForageInstance'
import { jwt } from '../utils/constant'

export default async function ({ $axios, redirect }, inject) {
  const token = await user.getItem(jwt)

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 404) {
      redirect('/404')
    }
  })

  $axios.setBaseURL('http://localhost/api/v1')
  $axios.setHeader('Authorization', `Bearer ${token}`)
}
