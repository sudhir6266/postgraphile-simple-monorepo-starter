<template>
  <div>
    <v-dialog v-model="editUserDialog" :max-width="500">
      <v-card v-if="editUser">
        <update-user-form
          :user="editUser"
          @updated="closeDialogsAndRefreshData"
        ></update-user-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteUserDialog" :max-width="500">
      <delete-user-form
        v-if="deleteUser"
        :user="deleteUser"
        @cancelled="deleteUserDialog = false"
        @deleted="closeDialogsAndRefreshData"
      ></delete-user-form>
    </v-dialog>
    <v-dialog v-model="createUserDialog" :max-width="500">
      <create-user-form
        @created="closeDialogsAndRefreshData"
      ></create-user-form>
    </v-dialog>
    <v-row dense>
      <v-col cols="4" align-self="center">
        <v-btn color="primary" small @click.stop="createUserDialog = true">
          <v-icon>mdi-plus</v-icon>
          Ajouter un utilisateur
        </v-btn>
      </v-col>
      <v-col cols="4" offset="4">
        <v-text-field
          v-model="filter"
          label="Rechercher"
          prepend-icon="mdi-account-search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :options.sync="options"
      :server-items-length="totalCount"
      :items="users"
      :loading="loading"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon small @click.stop="openEditUserDialog(item)">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon small @click.stop="openDeleteUserDialog(item)">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import { getUserSorting } from '~/store/user'

export default {
  components: {
    CreateUserForm: () => import('~/components/forms/user/CreateUserForm'),
    DeleteUserForm: () => import('~/components/forms/user/DeleteUserForm'),
    UpdateUserForm: () => import('~/components/forms/user/UpdateUserForm'),
  },
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
        { text: 'Actions', align: 'center', sortable: true, value: 'actions' },
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
      filter: null,
      loading: false,
      editUserDialog: false,
      editUser: null,
      deleteUserDialog: false,
      deleteUser: null,
      createUserDialog: false,
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
    filter: debounce(function () {
      this.updateUserList()
    }, 500),
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
        filter: this.filter,
      })
      this.loading = false
    },
    openEditUserDialog(user) {
      this.editUser = user
      this.editUserDialog = true
    },
    openDeleteUserDialog(user) {
      this.deleteUser = user
      this.deleteUserDialog = true
    },
    closeDialogsAndRefreshData() {
      this.editUserDialog = false
      this.deleteUserDialog = false
      this.createUserDialog = false
      this.updateUserList()
    },
  },
}
</script>
