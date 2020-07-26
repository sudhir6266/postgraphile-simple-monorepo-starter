import {RequestHandler} from 'express';
import {waitConnection} from "../utils/database-connection";

export const authenticationMiddleware: RequestHandler = async function (request, response, next) {
    const client = await waitConnection();
    try {
        let authToken = request.header('authorization');
        if (authToken) {
            const tokenPart = authToken.split(' ');
            if (tokenPart[0] === 'Bearer') {
                authToken = tokenPart[1];
            }
        }

        if (authToken) {
            const res = await client.query(
                "WITH t AS (SELECT public.verify_token($1) payload) select (payload::text::public.jwt_payload).email, (payload::text::public.jwt_payload).permission FROM t;",
                [authToken]
            );
            // @ts-ignore
            request.user = res.rows[0];
        }
    } catch (e) {
        console.log('Auth error :', e.message);
    }

    next();
}
