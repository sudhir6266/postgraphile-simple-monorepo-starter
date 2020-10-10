<template>
  <div class="pa-3">
    <h3 class="text-center mb-2">Création d'un utilisateur</h3>
    <v-form @submit.prevent="sendForm">
      <v-text-field
        v-model="email"
        dense
        outlined
        label="Adresse email"
        placeholder="Adresse email"
        :error-messages="emailErrors"
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      ></v-text-field>
      <v-select
        v-model="role"
        dense
        outlined
        :items="roleItems"
        label="Role (authorisations)"
        placeholder="Role"
        item-text="label"
        item-value="value"
        :error-messages="roleErrors"
        @input="$v.role.$touch()"
        @blur="$v.role.$touch()"
      ></v-select>
      <v-text-field
        v-model="password"
        dense
        outlined
        label="Mot de passe"
        placeholder="Mot de passe"
        type="password"
        :error-messages="passwordErrors"
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      ></v-text-field>
      <v-btn
        type="submit"
        class="d-block mx-auto"
        color="primary"
        :loading="loading"
        :disabled="loading || ($v.$dirty && $v.$invalid)"
      >
        Créer l'utilsateur
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, maxLength, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import get from 'lodash/get'
import oneOf from '~/validators/oneOf'
import CreateUser from '~/graphql/user/CreateUser.graphql'

export default {
  name: 'CreateUserForm',
  mixins: [validationMixin],
  validations: {
    email: { required, email, maxLength: maxLength(255) },
    role: { required, role: oneOf(['ADMIN', 'USER']) },
    password: { required, minLength: minLength(6), maxLength: maxLength(72) },
  },
  data() {
    return {
      email: null,
      role: null,
      roleItems: [
        { label: 'Administrateur', value: 'ADMIN' },
        { label: 'Utilisateur', value: 'USER' },
      ],
      password: null,
      loading: false,
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required &&
        errors.push("L'adresse email et requise pour la connexion")
      !this.$v.email.email &&
        errors.push('Vous devez indiquer une adresse email valide')
      !this.$v.email.maxLength &&
        errors.push("L'adresse email ne peut dépasser 255 charactères")
      return errors
    },
    roleErrors() {
      const errors = []
      if (!this.$v.role.$dirty) return errors
      !this.$v.role.required &&
        errors.push("Vous devez spécifié un role pour l'utilisateur")
      !this.$v.role.role && errors.push('Vous devez indiquer un role valide')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required &&
        errors.push('Le mot de passe ne peut être vide')
      !this.$v.password.minLength &&
        errors.push('Le mot de passe doit faire plus de 6 charactères')
      !this.$v.password.maxLength &&
        errors.push('Le mot de passe doit faire moins de 72 charactères')
      return errors
    },
  },
  methods: {
    ...mapActions('notification', ['pushNotification']),
    async sendForm() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          const { data } = await this.$apolloProvider.defaultClient.mutate({
            mutation: CreateUser,
            variables: {
              email: this.email,
              role: this.role,
              password: this.password,
            },
          })
          this.pushNotification({
            type: 'success',
            message: "L'utilisateur a été modifié avec succès",
          })
          this.$emit('created', get(data, 'createUser.user', null))
        } catch (e) {
          this.pushNotification({
            type: 'error',
            message: `Un erreur est survenue lors de la création de l'utilisateur : ${e.message}`,
          })
        } finally {
          this.loading = false
        }
      } else {
        this.pushNotification({
          type: 'warning',
          message: "Veuillez valider le formulaire avant de l'envoyer",
        })
      }
    },
  },
}
</script>
