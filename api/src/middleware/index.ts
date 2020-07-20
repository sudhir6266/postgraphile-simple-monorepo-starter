import postgraphile from "./postgraphile";
import {HttpRequestHandler} from "postgraphile/build/interfaces";

const middlewares: Array<HttpRequestHandler> = [
    postgraphile
];

export default middlewares;
