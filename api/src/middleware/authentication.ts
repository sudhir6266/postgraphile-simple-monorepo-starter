import { RequestHandler } from 'express';
import { pool } from "../config/database-pool";
import { UserJwtData } from "../interfaces/user-jwt-data";
import { ApiRequest } from "../interfaces/api-request";

export const authenticationMiddleware: RequestHandler = async function (request: ApiRequest, response, next) {
  try {
    let authToken = request.header('authorization');
    if (authToken) {
      const tokenPart = authToken.split(' ');
      if (tokenPart[0] === 'Bearer') {
        authToken = tokenPart[1];
      }
    }

    if (authToken) {
      const client = await pool.connect()
      const res = await client.query<UserJwtData, string[]>(
        "WITH t AS (SELECT public.verify_token($1) payload) select (payload::text::public.jwt_payload).email, (payload::text::public.jwt_payload).permission FROM t;",
        [authToken]
      );
      client.release()
      request.user = res.rows[0];
    }
  } catch (e) {
    console.log('Auth error :', e.message);
  }

  next();
}
