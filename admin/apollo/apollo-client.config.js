import { getBrowserCookie } from '~/utils/cookie/browserCookies'
import parseCookies from '~/utils/cookie/parseCookies'

export default ({ env, req }) => {
  // eslint-disable-next-line no-console
  return {
    httpEndpoint: env.serverHttpEndpoint || 'http://localhost:9002',
    browserHttpEndpoint: env.httpEndpoint || 'http://localhost:9002',
    wsEndpoint: env.websocketEndpoint,
    tokenName: 'token',
    getAuth() {
      if (process.client) {
        const token = getBrowserCookie('token')
        if (token) {
          return 'Bearer ' + token
        }
      } else {
        const cookies = parseCookies(req.headers.cookie)
        if (cookies.token) {
          return 'Bearer ' + cookies.token
        }
      }
      return null
    },
  }
}
