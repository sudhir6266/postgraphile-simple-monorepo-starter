--! Previous: sha1:d551220a06b37ed1d5a4c48033cd5cf346845f80
--! Hash: sha1:74859192eed2a153b678d3017ae283a5c634c448

-- Enter migration here
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USER TABLE MIGRATION

-- PUBLIC DROP
DROP TABLE IF EXISTS public.user;
DROP TRIGGER IF EXISTS encrypt_user_password ON public.user;
DROP DOMAIN IF EXISTS public.email_adress;
DROP TYPE IF EXISTS public.user_role;
DROP FUNCTION IF EXISTS encrypt_password;

-- PRIVATE DROP
DROP TABLE IF EXISTS private.jwt_secret;
DROP FUNCTION IF EXISTS private.generate_jwt_secret;
DROP FUNCTION IF EXISTS private.get_jwt_secret;

-- ROLE ENUM
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- DOMAIN EMAIL ADRESS : CHECKS VALID EMAIL AND LENGTH
CREATE DOMAIN public.email_adress AS TEXT CHECK (value ~* '^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$' AND LENGTH(value) <= 255);

-- USER TABLE
CREATE TABLE public.user (
                             id SERIAL NOT NULL PRIMARY KEY,
                             email public.email_adress NOT NULL UNIQUE,
                             password TEXT NOT NULL,
                             role public.user_role NOT NULL DEFAULT 'user'
);

-- TRIGGER FUNCTION ENCRYPT PASSWORD : CHECKS PASSWORD AND HASH IT
CREATE FUNCTION encrypt_password() RETURNS TRIGGER AS
$func$
DECLARE
    password_length INT := LENGTH(NEW.password);
BEGIN
    IF NEW.password IS NULL THEN
        RAISE EXCEPTION 'Password cannot be null' USING ERRCODE = 'user_password_not_null';
    END IF;

    IF password_length > 72 OR password_length < 6 THEN
        RAISE EXCEPTION 'Password length must be between 6 and 72 characters, % given', password_length USING ERRCODE = 'user_password_length';
    END IF;

    NEW.password := crypt(NEW.password, gen_salt('bf'));
    RETURN NEW;
END
$func$ LANGUAGE plpgsql;

-- TRIGGER encrypt_password ON insert/update of public.user.password
CREATE TRIGGER encrypt_user_password BEFORE INSERT OR UPDATE OF password ON public.user FOR EACH ROW EXECUTE PROCEDURE encrypt_password();

-- Insert default admin to user table
INSERT INTO public.user (email, password) VALUES ('admin@admin.com', '123456789') ON CONFLICT DO NOTHING;

-- JWT Secret table to keep track of the JWT SECRET
CREATE TABLE private.jwt_secret (
    secret TEXT DEFAULT uuid_generate_v4(),
    created_at timestamp DEFAULT NOW()
);

-- GENERATE JWT SECRET AND SAVE IT TO private.jwt_secret
CREATE FUNCTION private.generate_jwt_secret() RETURNS text AS $$
    DECLARE
        secret_uuid TEXT := uuid_generate_v4();
    BEGIN
        INSERT INTO private.jwt_secret(secret) VALUES (secret_uuid);
        RETURN secret_uuid;
    END;
$$ language plpgsql;

-- GET LAST JWT SECRET
CREATE FUNCTION private.get_jwt_secret() RETURNS text as $$
    declare
        jwt_secret text := null;
    begin
        select j.secret into jwt_secret from private.jwt_secret j order by j.created_at desc limit 1;
        if jwt_secret is null then
            RETURN private.generate_jwt_secret();
        end if;
        return jwt_secret;
    end;
    $$ language plpgsql;
