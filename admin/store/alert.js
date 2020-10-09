import uniqueId from 'lodash/uniqueId'
import clone from 'lodash/clone'

export function state() {
  return {
    alerts: {},
  }
}

export const getters = {
  alerts(state) {
    const formattedAlerts = {}
    for (const id in { ...state.alerts }) {
      formattedAlerts[id] = Object.assign(
        {
          id,
          type: 'info',
          color: undefined,
          prominent: false,
          dense: true,
          dismissible: true,
          icon: undefined,
          outlined: false,
          text: false,
          message: '',
        },
        state.alerts[id]
      )
    }
    return formattedAlerts
  },
}

export const mutations = {
  reset(state) {
    state.alerts = {}
  },
  setAlert(state, { id, alert }) {
    state.alerts[id] = alert
    state.alerts = clone(state.alerts)
  },
  deleteAlert(state, id) {
    if (Object.prototype.hasOwnProperty.call(state.alerts, id)) {
      delete state.alerts[id]
      state.alerts = clone(state.alerts)
    }
  },
}

export const actions = {
  pushAlert({ commit }, alert) {
    const id = uniqueId('store_alert_')
    commit('setAlert', {
      id,
      alert: clone(alert),
    })
    if (alert.timeout) {
      setTimeout(() => {
        commit('deleteAlert', id)
      }, alert.timeout)
    }
  },
  deleteAlert({ commit }, id) {
    commit('deleteAlert', id)
  },
}
