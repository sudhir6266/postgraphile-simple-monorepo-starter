<template>
  <v-card>
    <v-card-title class="mb-5">
      <div class="text-sm-body-1">
        Êtes-vous sûre de vouloir supprimer {{ $props.user.email }} ?
      </div>
    </v-card-title>
    <v-card-actions class="d-flex flex-row align-center justify-space-between">
      <v-btn
        small
        color="primary"
        :disabled="loading"
        :loading="loading"
        @click.stop="deleteUser"
      >
        Oui
      </v-btn>
      <v-btn small :disabled="loading" @click.stop="$emit('cancelled')">
        Non
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import get from 'lodash/get'
import DeleteUserByNodeId from '~/graphql/user/DeleteUserByNodeId.graphql'

export default {
  name: 'DeleteUserForm',
  props: {
    user: {
      type: Object,
      required: true,
      validator: (user) => {
        return (
          Object.prototype.hasOwnProperty.call(user, 'id') &&
          Object.prototype.hasOwnProperty.call(user, 'nodeId') &&
          Object.prototype.hasOwnProperty.call(user, 'email') &&
          Object.prototype.hasOwnProperty.call(user, 'role')
        )
      },
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    ...mapActions('notification', ['pushNotification']),
    async deleteUser() {
      this.loading = true
      try {
        const { data } = await this.$apolloProvider.defaultClient.mutate({
          mutation: DeleteUserByNodeId,
          variables: {
            nodeId: this.$props.user.nodeId,
          },
        })
        this.pushNotification({
          type: 'success',
          message: 'Utilisateur supprimé avec succès',
        })
        this.$emit('deleted', get(data, 'deleteUserByNodeId.deletedUserNodeId'))
      } catch (e) {
        this.pushNotification({
          type: 'error',
          message: `Une erreur est survenue lors de la suppression de l'utilisateur : ${e.message}`,
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
