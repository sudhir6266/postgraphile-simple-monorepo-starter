# Simple postgraphile starter with NUXT.

This repository provide a very simple starter template to start project very quickly.

To start programming just type `docker-compose -f docker-compose.dev.yml up -d`

# Commands

To execute command, you use `docker-compose -f "docker-compose.dev.yml" exec [service] [command]`

Service being one of :
- migrate-watch
- api
- admin
- webapp
- database
- nginx
- keycloak

And command, the command you wish to execute.

For instance, here is some exemple of commands you might have to use often :

- Commit : `docker-compose -f "docker-compose.dev.yml" exec migrate-watch yarn run migrate-commit`

- Uncommit : `docker-compose -f "docker-compose.dev.yml" exec migrate-watch yarn run migrate-commit`

- Reset : `docker-compose -f "docker-compose.dev.yml" exec migrate-watch yarn run migrate-commit`

- Add lodash to webapp : `docker-compose -f "docker-compose.dev.yml" exec webapp yarn add lodash`

# TODO

- Add worker support
- Add production configuration
