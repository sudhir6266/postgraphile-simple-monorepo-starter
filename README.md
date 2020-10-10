# Simple postgraphile starter with NUXT.

This repository provide a very simple starter template to start project very quickly.

To start programming just type `docker-compose -f docker-compose.yml up -d`

# Commands

To execute command, you use `docker-compose -f "docker-compose.yml" exec [service] [command]`

Service being one of :
- migrate-watch
- api
- admin
- webapp
- database
- nginx

And command, the command you wish to execute.

For instance, here is some exemple of commands you might have to use often :

- Commit : `docker-compose -f "docker-compose.yml" exec migrate-watch yarn run migrate-commit`

- Uncommit : `docker-compose -f "docker-compose.yml" exec migrate-watch yarn run migrate-commit`

- Reset : `docker-compose -f "docker-compose.yml" exec migrate-watch yarn run migrate-commit`

- Add lodash to webapp : `docker-compose -f "docker-compose.yml" exec webapp yarn add lodash`

# Admin account

- email : admin@admin.com
- password : 123456789

# TODO

- Add worker support
- Add production configuration
