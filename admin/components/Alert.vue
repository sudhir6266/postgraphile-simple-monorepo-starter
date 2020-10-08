<template>
  <div
    class="col-lg-6 col-md-8 col-sm-10 col-12 offset-lg-3 offset-md-2 offset-sm-1"
    style="position: absolute; z-index: 999999;"
  >
    <v-fade-transition group leave-absolute>
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="w-100 mt-2"
        @click="deleteUnlessActive(alert.id)"
      >
        <v-alert
          :ref="alert.id"
          :color="alert.color"
          :dense="alert.dense"
          :dismissible="alert.dismissible"
          :icon="alertIcon(alert)"
          :outlined="false"
          :prominent="alert.prominent"
          :text="alert.text"
          :type="alert.type"
          border="left"
          class="v-alert"
          elevation="2"
          transition="fade"
        >
          {{ alert.message }}
        </v-alert>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import get from 'lodash/get'

export default {
  name: 'Alert',
  data() {
    return {}
  },
  computed: {
    ...mapGetters('alert', ['alerts']),
  },
  methods: {
    ...mapActions('alert', ['pushAlert', 'deleteAlert']),
    alertIcon(alert) {
      if (alert.icon) {
        return alert.icon
      }
      switch (alert.type) {
        case 'error':
          return 'mdi-alert-octagon-outline'
        case 'warning':
          return 'mdi-alert'
        case 'success':
          return 'mdi-check-circle'
        case 'info':
          return 'mdi-information'
        default:
          return undefined
      }
    },
    deleteUnlessActive(id) {
      const isActive = get(this.$refs, id + '[0]._data.isActive', true)
      if (!isActive) {
        this.deleteAlert(id)
      }
    },
  },
}
</script>

<style scoped>
.col-lg-6,
.col-md-8,
.col-sm-10,
.col-12 {
  padding: 0 !important;
}

.v-alert {
  margin-bottom: 0 !important;
}
</style>
