<template>
  <div>
    Liste utilisateurs ici
    <p>{{ users }}</p>
    <v-data-table
      :headers="headers"
      :options.sync="options"
      :server-items-length="totalCount"
      :items="users"
      :loading="loading"
    ></v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getUserSorting } from '~/store/user'

export default {
  async asyncData({ store }) {
    await store.dispatch('user/fetchUsers', {
      offset: 0,
      itemsPerPage: 50,
      orderBy: 'PRIMARY_KEY_ASC',
    })
    return {}
  },
  data() {
    return {
      headers: [
        { text: 'ID', align: 'center', sortable: true, value: 'id' },
        {
          text: 'Adresse email',
          align: 'left',
          sortable: true,
          value: 'email',
        },
        { text: 'Role', align: 'left', sortable: false, value: 'role' },
      ],
      options: {},
      loading: false,
    }
  },
  computed: {
    ...mapGetters('user', {
      users: 'getUsers',
      totalCount: 'getTotalCount',
    }),
  },
  watch: {
    options: {
      handler() {
        this.updateUserList()
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('user', ['fetchUsers']),
    async updateUserList() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      this.loading = true
      await this.fetchUsers({
        page,
        itemsPerPage,
        orderBy: getUserSorting(sortBy[0], sortDesc[0]),
      })
      this.loading = false
    },
  },
}
</script>
