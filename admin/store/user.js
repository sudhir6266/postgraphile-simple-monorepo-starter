import UsersList from '~/graphql/user/UsersList.graphql'

export function state() {
  return {
    users: [],
    totalCount: 0,
  }
}

export const getters = {
  getUsers(state) {
    return state.users
  },
  getTotalCount(state) {
    return state.totalCount
  },
}

export const mutations = {
  setUsers(state, value) {
    state.users = value
  },
  setTotalCount(state, value) {
    state.totalCount = value
  },
}

export const actions = {
  async fetchUsers({ commit }, { itemsPerPage, offset, orderBy }) {
    const { data } = await this.app.apolloProvider.defaultClient.query({
      query: UsersList,
      variables: {
        offset: offset || 0,
        itemsPerPage: itemsPerPage || 25,
        orderBy: orderBy || 'PRIMARY_KEY_ASC',
      },
    })
    commit('setUsers', data.users.nodes)
    commit('setTotalCount', data.users.totalCount)
  },
}

export function getUserSorting(sortBy, sortDesc) {
  switch (sortBy) {
    case 'id':
      return 'ID_' + (sortDesc ? 'DESC' : 'ASC')
    case 'email':
      return 'EMAIL_' + (sortDesc ? 'DESC' : 'ASC')
    case 'primary':
      return 'PRIMARY_KEY_' + (sortDesc ? 'DESC' : 'ASC')
    default:
      return 'NATURAL'
  }
}
