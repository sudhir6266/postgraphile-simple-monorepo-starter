<template>
  <v-layout column justify-center align-center>
    DATA ici
    <v-btn
      color="primary"
      @click.stop="pushNotification({ type: 'error', message: 'Test' })"
      >test
    </v-btn>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {},
  methods: {
    ...mapActions('notification', ['pushNotification']),
  },
  head() {
    return {
      title: 'Home',
      meta: [
        { hid: 'Accueil admin' },
        { name: 'Accueil admin' },
        { content: "Page d'accueil du panneau de control admin" },
      ],
    }
  },
}
</script>
