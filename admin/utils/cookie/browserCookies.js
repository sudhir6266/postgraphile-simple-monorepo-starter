import parseCookies from '~/utils/cookie/parseCookies'

export function setBrowserCookie(name, value, date) {
  let expires = ''
  if (date) {
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + ';path=/'
}

export function getBrowserCookie(name) {
  return parseCookies(document.cookie)[name] || null
}

export function eraseBrowserCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
