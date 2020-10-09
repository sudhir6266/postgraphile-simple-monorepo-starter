export default function ({ store, redirect }) {
  // eslint-disable-next-line no-console
  if (
    !store.getters['auth/isAuthenticated'] ||
    !store.getters['auth/isAdmin']
  ) {
    // eslint-disable-next-line no-console
    return redirect('/user/login')
  }
}
