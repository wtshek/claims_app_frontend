export default {
  getData() {
    return '/transports.php'
  },

  addRecord() {
    return '/user/claims.php'
  },
  editRecord(id) {
    return `/user/claims.php?id=${id}`
  },
  deleteRecord(id) {
    return `/user/claims.php?id=${id}&delete=true`
  },
  getRecords(lastUpdate) {
    return `/user/claims.php?last-update=${lastUpdate}`
  },
  login() {
    return '/user/login.php'
  },
  signUp() {
    return '/user/signup.php'
  },
}
