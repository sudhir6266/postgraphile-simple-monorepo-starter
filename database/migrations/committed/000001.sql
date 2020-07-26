--! Previous: -
--! Hash: sha1:d551220a06b37ed1d5a4c48033cd5cf346845f80

-- Enter migration here
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP FUNCTION IF EXISTS private.url_encode;
DROP FUNCTION IF EXISTS private.url_decode;
DROP FUNCTION IF EXISTS private.algorithm_sign;
DROP FUNCTION IF EXISTS private.sign;
DROP FUNCTION IF EXISTS private.verify;
DROP SCHEMA IF EXISTS private;

CREATE SCHEMA private;

CREATE FUNCTION private.url_encode(data bytea) RETURNS text
    LANGUAGE sql AS
$$
SELECT translate(encode(data, 'base64'), E'+/=\n', '-_');
$$;


CREATE FUNCTION private.url_decode(data text) RETURNS bytea
    LANGUAGE sql AS
$$
WITH t AS (SELECT translate(data, '-_', '+/') AS trans),
     rem AS (SELECT length(t.trans) % 4 AS remainder FROM t) -- compute padding size
SELECT decode(
                   t.trans ||
                   CASE
                       WHEN rem.remainder > 0
                           THEN repeat('=', (4 - rem.remainder))
                       ELSE '' END,
                   'base64')
FROM t,
     rem;
$$;


CREATE FUNCTION private.algorithm_sign(signables text, secret text, algorithm text)
    RETURNS text
    LANGUAGE sql AS
$$
WITH alg AS (
    SELECT CASE
               WHEN algorithm = 'HS256' THEN 'sha256'
               WHEN algorithm = 'HS384' THEN 'sha384'
               WHEN algorithm = 'HS512' THEN 'sha512'
               ELSE '' END AS id) -- hmac throws error
SELECT private.url_encode(hmac(signables, secret, alg.id))
FROM alg;
$$;


CREATE FUNCTION private.sign(payload json, secret text, algorithm text DEFAULT 'HS256')
    RETURNS text
    LANGUAGE sql AS
$$
WITH header AS (
    SELECT private.url_encode(convert_to('{"alg":"' || algorithm || '","typ":"JWT"}', 'utf8')) AS data
),
     payload AS (
         SELECT private.url_encode(convert_to(payload::text, 'utf8')) AS data
     ),
     signables AS (
         SELECT header.data || '.' || payload.data AS data
         FROM header,
              payload
     )
SELECT signables.data || '.' ||
       private.algorithm_sign(signables.data, secret, algorithm)
FROM signables;
$$;


CREATE FUNCTION private.verify(token text, secret text, algorithm text DEFAULT 'HS256')
    RETURNS table
            (
                header  json,
                payload json,
                valid   boolean
            )
    LANGUAGE sql
AS
$$
SELECT convert_from(private.url_decode(r[1]), 'utf8')::json                  AS header,
       convert_from(private.url_decode(r[2]), 'utf8')::json                  AS payload,
       r[3] = private.algorithm_sign(r[1] || '.' || r[2], secret, algorithm) AS valid
FROM regexp_split_to_array(token, '\.') r;
$$;
