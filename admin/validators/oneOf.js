import { helpers } from 'vuelidate/lib/validators'

export default function (param) {
  return (value) => !helpers.req(value) || param.includes(value)
}
