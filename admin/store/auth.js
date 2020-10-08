import jwtDecode from 'jwt-decode'
import get from 'lodash/get'
import Login from '~/graphql/Login.graphql'
import {
  eraseBrowserCookie,
  getBrowserCookie,
  setBrowserCookie,
} from '~/utils/cookie/browserCookies'

export function state() {
  return {
    initialized: false,
    loading: false,
    data: null,
    error: null,
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.data
  },
  email(state) {
    return get(state, 'data.email', null)
  },
  permissions(state) {
    return get(state, 'data.permission', null)
  },
  isAdmin(state) {
    return get(state, 'data.permission', null) === 'admin'
  },
  isUser(state) {
    return get(state, 'data.permission', null) !== 'admin'
  },
}

export const mutations = {
  initialize(state) {
    state.initialized = true
  },
  setLoading(state, loading) {
    state.loading = !!loading
  },
  setError(state, error) {
    state.data = null
    state.error = error
  },
  setData(state, data) {
    state.data = data
  },
}

export const actions = {
  async login({ commit, dispatch }, { email, password }) {
    commit('setLoading', true)
    try {
      const { data } = await this.app.apolloProvider.defaultClient.mutate({
        mutation: Login,
        variables: {
          email,
          password,
        },
      })
      const permission = get(data, 'authenticate.jwtPayload.permission', null)
      const token = get(data, 'authenticate.jwtPayload.token', null)
      const exp = get(data, 'authenticate.jwtPayload.exp', null)
      // eslint-disable-next-line no-console
      console.log(data, permission)
      if (permission !== 'admin') {
        commit('setError', "Vous n'êtes pas admin")
      }
      setBrowserCookie('token', token, exp ? new Date(exp * 1000) : null)
      return dispatch('decodeToken', token)
    } catch (e) {
      commit('setError', e)
    } finally {
      commit('setLoading', false)
    }
  },
  logout({ commit }) {
    if (process.client) {
      eraseBrowserCookie('token')
    }
    commit('setData', null)
  },
  decodeToken({ commit }, token) {
    if (token) {
      try {
        commit('setData', jwtDecode(token))
      } catch (e) {
        commit('setError', e)
      }
    }
  },
  initStore({ dispatch, commit }, token) {
    commit('initialize')
    if (process.client) {
      token = getBrowserCookie('token')
    }
    return dispatch('decodeToken', token || null)
  },
}
