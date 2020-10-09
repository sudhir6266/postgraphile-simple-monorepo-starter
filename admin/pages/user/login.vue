<template>
  <v-row
    id="root-login-template"
    align="center"
    justify="center"
    class="fill-height"
  >
    <v-col cols="12" lg="3" md="4" sm="6">
      <v-card>
        <v-card-title>Connexion</v-card-title>
        <v-card-text class="pb-0">
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              :disabled="authenticateLoading"
              dense
              outlined
              label="Adresse email"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              :disabled="authenticateLoading"
              dense
              type="password"
              outlined
              label="Mot de passe"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            ></v-text-field>
            <div class="w-100 d-flex flex-row align-center justify-center pt-0">
              <v-btn
                color="primary"
                type="submit"
                class="mb-3"
                rounded
                :disabled="authenticateLoading"
                :loading="authenticateLoading"
                @click.stop="login"
              >
                Connexion
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
  layout: 'empty',
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required },
  },
  data() {
    return {
      email: null,
      password: null,
    }
  },
  computed: {
    ...mapState('auth', {
      authenticateError: 'error',
      authenticateLoading: 'loading',
    }),
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email &&
        errors.push('Vous devez indiquer une adresse email valide')
      !this.$v.email.required &&
        errors.push("L'adresse email et requise pour la connexion")
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required &&
        errors.push(
          'Vous devez indiquer votre mot de passe pour vous connecter'
        )
      return errors
    },
  },
  methods: {
    ...mapActions('auth', {
      authenticateUser: 'login',
    }),
    ...mapActions('notification', ['pushNotification']),
    async login() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.authenticateUser({
          email: this.email,
          password: this.password,
        })
        if (this.authenticateError) {
          this.pushNotification({
            type: 'error',
            message: this.authenticateError,
          })
          return
        }
        // eslint-disable-next-line no-console
        await this.$router.push({ path: '/' })
      } else {
        this.pushNotification({
          type: 'error',
          message:
            'Le formulaire est invalide, veuillez verifier les champs email et mot de passe',
        })
      }
    },
  },
  head() {
    return {
      title: 'Login page',
    }
  },
}
</script>

<style scoped>
#root-login-template {
  background-image: url('~assets/img/login_background.jpg');
  background-size: cover;
}
</style>
