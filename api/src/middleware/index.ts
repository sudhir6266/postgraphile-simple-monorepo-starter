
import postgraphile from "./postgraphile";
import {authenticationMiddleware} from "./authentication";
import {RequestHandler} from "express";

// Postgraphile should go after middlewares such as authentication middleware that adds user to request
const middlewares: Array<RequestHandler> = [
  authenticationMiddleware,
  postgraphile,
];

export default middlewares;
