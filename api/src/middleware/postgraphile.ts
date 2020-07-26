import { postgraphile } from 'postgraphile';
import pgSimplifyInflector from "@graphile-contrib/pg-simplify-inflector";
import {PostGraphileOptions} from "postgraphile/build/interfaces";
import { IncomingMessage } from 'http';
// @ts-ignore
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';

const pgSettings = function (req: IncomingMessage) {
    const settings: {'role'?: string, 'user.role'?: string, 'user.email'?: string} = {role: 'anonymous', 'user.role': 'anonymous'};
    // @ts-ignore
    const user = req.user;
    if (user) {
        settings["role"] = user.permission;
        settings["user.role"] = user.permission;
        settings["user.email"] = user.email;
    }

    console.log(settings, user);
    return settings;
}

const devOptions: PostGraphileOptions = {
    subscriptions: true,
    watchPg: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    ignoreIndexes: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    appendPlugins: [pgSimplifyInflector, ConnectionFilterPlugin],
    exportGqlSchemaPath: "schema.graphql",
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain(req: IncomingMessage) {
        return true;
    },
    enableQueryBatching: true,
    legacyRelations: "omit",
    pgSettings,
};

const productionOptions: PostGraphileOptions = {
    subscriptions: true,
    retryOnInitFail: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    ignoreIndexes: false,
    extendedErrors: ["errcode"],
    appendPlugins: [pgSimplifyInflector],
    graphiql: false,
    enableQueryBatching: true,
    disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
    legacyRelations: "omit",
    pgSettings,
}

export default postgraphile(
    process.env.DATABASE_URL || "postgres://postgres:root@localhost:5433/main",
    "public",
    process.env.APP_ENV === 'production' ? productionOptions : devOptions
);
