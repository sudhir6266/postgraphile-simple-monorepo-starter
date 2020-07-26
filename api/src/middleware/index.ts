import postgraphile from "./postgraphile";
import {authenticationMiddleware} from "./authentication";
import {RequestHandler} from "express";

const middlewares: Array<RequestHandler> = [
    authenticationMiddleware,
    postgraphile,
];

export default middlewares;
