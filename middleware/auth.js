import { user } from '../utils/localForageInstance'
import { defaultLanding } from '../config/routes'
import { jwt } from '../utils/constant'

async function auth({ store, redirect, route }) {
  // TODO: auth logic
  const token = await user.getItem(jwt)

  if (!token) {
    return redirect('/login')
  }

  if (route.path === '/') {
    return redirect(defaultLanding.route)
  }
}

export default auth
