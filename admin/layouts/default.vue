<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list dense nav>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          color="primary"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="primary" small @click.stop="logout">
            Se déconnecter
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar fixed app clipped-left dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="darkMode = !darkMode">
        <v-icon>mdi-brightness-4</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <notification></notification>
        <nuxt />
        <alert></alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Alert from '~/components/Alert'
import Notification from '~/components/Notification'

export default {
  components: { Notification, Alert },
  middleware: 'requireAdmin',
  data() {
    return {
      drawer: true,
      title: 'Admin control pannel',
      items: [
        {
          icon: 'mdi-home',
          title: 'Accueil',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'Utilisateurs',
          to: '/user/list',
        },
      ],
    }
  },
  computed: {
    ...mapState('snackbar', {
      snackbarList: 'items',
    }),
    ...mapGetters('darkMode', ['getDarkMode']),
    darkMode: {
      get() {
        return this.getDarkMode
      },
      set(value) {
        this.$vuetify.theme.dark = value
        this.setDarkMode(value)
      },
    },
  },
  created() {
    this.$vuetify.theme.dark = this.getDarkMode
  },
  methods: {
    ...mapActions('auth', { storeLogout: 'logout' }),
    ...mapActions('darkMode', ['setDarkMode']),
    logout() {
      this.storeLogout()
      this.$router.push('/user/login')
    },
  },
}
</script>
