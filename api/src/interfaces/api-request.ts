import { Request } from "express";
import { UserJwtData } from "./user-jwt-data";

export interface ApiRequest extends Request {
  user?: null | undefined | UserJwtData
}
