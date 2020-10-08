import parseCookies from '~/utils/cookie/parseCookies'

export const actions = {
  nuxtServerInit({ dispatch }, { req }) {
    const cookies = parseCookies(req.headers.cookie)
    dispatch('auth/initStore', cookies.token || null)
    dispatch('darkMode/initStore', cookies.darkMode === 'true')
  },
}
