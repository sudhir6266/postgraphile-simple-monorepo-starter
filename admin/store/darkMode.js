import { setBrowserCookie } from '~/utils/cookie/browserCookies'

export function state() {
  return {
    darkMode: false,
  }
}

export const getters = {
  getDarkMode(state) {
    return state.darkMode
  },
}

export const mutations = {
  setDarkMode(state, value) {
    state.darkMode = value
  },
}

export const actions = {
  toggleDarkMode({ commit, getters }) {
    const darkMode = !getters.getDarkMode
    commit('setDarkMode', darkMode)
    setBrowserCookie('darkMode', darkMode)
  },
  setDarkMode({ commit }, value) {
    commit('setDarkMode', !!value)
    setBrowserCookie('darkMode', value)
  },
  initStore({ commit }, value) {
    commit('setDarkMode', value)
  },
}
