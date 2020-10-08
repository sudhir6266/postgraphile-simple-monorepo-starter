<template>
  <v-app>
    <notification></notification>
    <v-layout align-center justify-center>
      <nuxt></nuxt>
    </v-layout>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Notification from '~/components/Notification'

export default {
  components: { Notification },
  transition: 'slide-x-transition',
  middleware: 'requireNotAdmin',
  data() {
    return {}
  },
  computed: {
    ...mapState('snackbar', {
      snackbarList: 'items',
    }),
  },
  methods: {
    ...mapMutations('snackbar', {
      removeSnackbar: 'removeItem',
    }),
  },
}
</script>
