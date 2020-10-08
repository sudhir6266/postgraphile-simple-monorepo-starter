export default function parseCookies(cookieString) {
  if (cookieString) {
    return Object.fromEntries(
      cookieString.split(/; */).map((c) => {
        const [key, ...v] = c.split('=')
        return [key, decodeURIComponent(v.join('='))]
      })
    )
  }
  return {}
}
