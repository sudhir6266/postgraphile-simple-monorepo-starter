<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      style="white-space: pre-line;"
      >{{ message }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      vSnackbar: null,
    }
  },
  computed: {
    snackbar: {
      get() {
        if (this.vSnackbar !== null) {
          const results = this.vSnackbar
          this.resetSnackbar()
          return results
        }
        return this.$store.state.notification.current !== null
      },
      set(value) {
        this.vSnackbar = value
      },
    },
    timeout() {
      return this.$store.state.notification.current
        ? this.$store.state.notification.current.timeout || 4000
        : 4000
    },
    color() {
      return this.$store.state.notification.current
        ? this.$store.state.notification.current.type || 'info'
        : 'info'
    },
    message() {
      return this.$store.state.notification.current
        ? this.$store.state.notification.current.message || ''
        : ''
    },
  },
  methods: {
    resetSnackbar() {
      setTimeout(() => {
        this.vSnackbar = null
      }, 200)
    },
  },
}
</script>
