export function state() {
  return {
    current: null,
    queue: [],
    timeoutId: undefined,
    active: false,
    lastTimeout: null,
  }
}

export const getters = {}

export const mutations = {
  reset(state) {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId)
    }

    state.current = null
    state.queue = []
    state.timeoutId = null
    state.active = false
    state.lastTimeout = null
  },
  queue(state, payload) {
    const type = payload.type || 'info'
    const message = payload.message || ''
    const timeout = payload.timeout || 4000
    state.queue = [
      ...state.queue,
      {
        type,
        message,
        timeout,
      },
    ]
  },
  dequeue(state, timeoutId) {
    const [current, ...queue] = state.queue
    state.queue = queue
    state.current = current
    state.timeoutId = timeoutId
  },
  setActive(state, active) {
    state.active = active
  },
  setLastTimeout(state, lastTimeout) {
    state.lastTimeout = lastTimeout
  },
}

export const actions = {
  pushNotification({ state, commit, dispatch }, notification) {
    commit('queue', notification)
    if (!state.active) {
      commit('setActive', true)
      dispatch('processQueue')
    }
  },
  processQueue({ state, commit, dispatch }) {
    if (!state.active) {
      return
    }

    if (state.queue.length === 0) {
      return commit('reset')
    }

    const timeout =
      (state.queue.length > 0 ? state.queue[0].timeout || 4000 : 4000) + 200
    commit('setLastTimeout', timeout)
    const timeoutId = setTimeout(() => {
      dispatch('processQueue')
    }, timeout)
    commit('dequeue', timeoutId)
  },
}
