// label refer to key in locales file in static

const signUp = {
  route: '/sign-up',
  label: 'signUp',
}

const login = {
  route: '/login',
  label: 'login',
}

const logout = {
  route: '/user/:id/logout',
  label: 'logout',
}
const submissionRecords = {
  route: '/user/:id/submission-records',
  label: 'records',
}

const createRecord = {
  route: '/user/:id/submit-record',
  label: 'newRecords',
}

const savedRoutes = {
  route: '/user/:id/saved-routes',
  label: 'savedRecords',
}

const profile = {
  route: '/user/:id',
  label: 'profile',
}

const nav = [submissionRecords, createRecord, profile, logout]

const allRoutes = [signUp, login, logout, ...nav]

const defaultLanding = submissionRecords

export {
  nav,
  signUp,
  login,
  logout,
  defaultLanding,
  allRoutes,
  createRecord,
  profile,
  submissionRecords,
  savedRoutes,
}
