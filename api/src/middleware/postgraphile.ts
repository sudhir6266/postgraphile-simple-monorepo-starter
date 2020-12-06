import { postgraphile, makePluginHook } from 'postgraphile';
import pgSimplifyInflector from '@graphile-contrib/pg-simplify-inflector';
import { PostGraphileOptions } from 'postgraphile/build/interfaces';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import PgPubSub from '@graphile/pg-pubsub';
import { ApiRequest } from "../interfaces/api-request";
import { pool } from "../config/database-pool";

const isDev = process.env.APP_ENV === 'dev';

const pgSettings = function ({ user }: ApiRequest) {
  const settings: { 'role'?: string, 'user.role'?: string, 'user.email'?: string } = {
    role: 'anonymous',
    'user.role': 'anonymous'
  };
  if (user) {
    settings["role"] = user.permission;
    settings["user.role"] = user.permission;
    settings["user.email"] = user.email;
  }

  return settings;
}

const pluginHook = makePluginHook([PgPubSub]);

const postGraphileOptions: PostGraphileOptions = {
  pluginHook,
  subscriptions: true,
  simpleSubscriptions: false,
  websocketMiddlewares: [],
  watchPg: isDev,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins: [pgSimplifyInflector, ConnectionFilterPlugin],
  graphiql: isDev,
  enhanceGraphiql: true,
  allowExplain({ user }: ApiRequest) {
    return isDev || user?.permission === 'admin';
  },
  enableQueryBatching: true,
  legacyRelations: "omit",
  retryOnInitFail: true,
  pgSettings
};

if (isDev) {
  postGraphileOptions.exportGqlSchemaPath = "schema.graphql";
} else {
  postGraphileOptions.disableQueryLog = true;
}

const schemas = process.env.DATABASE_SCHEMAS
  ? process.env.DATABASE_SCHEMAS.split(',')
  : ['public'];

export default postgraphile(
  pool,
  schemas,
  postGraphileOptions
);
