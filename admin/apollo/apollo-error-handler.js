export default ({ graphQLErrors, networkError, operation, forward }) => {
  // eslint-disable-next-line no-console
  console.log('Global error handler')
  // eslint-disable-next-line no-console
  console.log(graphQLErrors, networkError, operation, forward)
}
