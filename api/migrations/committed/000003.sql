--! Previous: sha1:74859192eed2a153b678d3017ae283a5c634c448
--! Hash: sha1:f7f0d28539621c03f4733ed6d3bd841ae8fe6815

-- CREATE ROLES
DO $$
    BEGIN
        CREATE ROLE anonymous nologin;
        EXCEPTION WHEN DUPLICATE_OBJECT THEN RAISE NOTICE 'Not creating role anonymous it already exists';
    end;
$$;

DO $$
    BEGIN
        CREATE ROLE "user" nologin;
        EXCEPTION WHEN DUPLICATE_OBJECT THEN RAISE NOTICE 'Not creating role user it already exists';
    end;
$$;

DO $$
    BEGIN
        CREATE ROLE admin nologin;
        EXCEPTION WHEN DUPLICATE_OBJECT THEN RAISE NOTICE 'Not creating admin anonymous it already exists';
    end;
$$;

-- DROP
DROP FUNCTION IF EXISTS public.register;
DROP FUNCTION IF EXISTS public.authenticate;
DROP FUNCTION IF EXISTS public.verify_token;
DROP FUNCTION IF EXISTS public.current_user_email;
DROP TYPE IF EXISTS public.jwt_payload;
DROP TYPE IF EXISTS private.jwt_decrypted_data;

-- DROP GRANTS
REVOKE ALL PRIVILEGES ON public.user FROM admin;
REVOKE ALL PRIVILEGES ON public.user FROM "user";
REVOKE ALL PRIVILEGES ON public.user FROM anonymous;

CREATE TYPE public.jwt_payload AS (
    token TEXT,
    email TEXT,
    permission TEXT,
    exp DOUBLE PRECISION
);

CREATE TYPE private.jwt_decrypted_data AS (
    header JSON,
    payload JSON,
    valid BOOLEAN
);

CREATE FUNCTION public.authenticate(email_address text, user_password text) RETURNS jwt_payload AS $$
DECLARE
    input_role text := (SELECT u.role FROM public.user u WHERE u.email = email_address AND u.password = crypt(user_password, u.password));
    exp double precision := extract(epoch from now() + interval '7 days');
BEGIN
    IF input_role is null THEN
        RAISE EXCEPTION 'User not found' USING HINT = 'Check email and password combination';
    end if;

    RETURN ROW(private.sign(json_build_object('exp', exp,'email', email_address, 'permission', input_role), private.get_jwt_secret()), email_address, input_role, exp);
END;
$$ language plpgsql VOLATILE SECURITY DEFINER;

CREATE FUNCTION public.register(email_address text, user_password text) RETURNS jwt_payload AS $func_2$
    BEGIN
        INSERT INTO public.user(email, password) VALUES (email_address, user_password);
        RETURN public.authenticate(email_address, user_password);
    END;
$func_2$ language plpgsql VOLATILE SECURITY DEFINER;

CREATE FUNCTION public.verify_token(token text) RETURNS jwt_payload AS $$
    DECLARE
        decrypted_token private.jwt_decrypted_data := private.verify(token, private.get_jwt_secret());
        email text := decrypted_token.payload->>'email';
        permission text := decrypted_token.payload->>'permission';
        exp double precision := decrypted_token.payload->>'exp';
    BEGIN
        IF NOT decrypted_token.valid OR exp IS NULL OR extract(epoch FROM now()) > exp THEN
            RAISE EXCEPTION 'Invalid JWT';
        end if;
        RETURN ROW (token, email, permission, exp);
    END;
$$ language plpgsql STABLE SECURITY DEFINER;

CREATE FUNCTION public.current_user_email() RETURNS text AS $$
    select nullif(current_setting('user.email', true), '');
$$ language SQL STABLE SECURITY DEFINER;

UPDATE public.user SET role = 'admin' WHERE email = 'admin@admin.com';

GRANT SELECT ON public.user TO admin;
GRANT DELETE ON public.user TO admin;
GRANT INSERT (email, password, role) ON public.user TO admin;
GRANT UPDATE (email, password, role) ON public.user TO admin;

GRANT EXECUTE ON FUNCTION public.authenticate(text, text) TO "user";
GRANT EXECUTE ON FUNCTION public.authenticate(text, text) TO "anonymous";
GRANT EXECUTE ON FUNCTION public.authenticate(text, text) TO "admin";

GRANT EXECUTE ON FUNCTION public.register(text, text) TO "anonymous";

GRANT EXECUTE ON FUNCTION public.verify_token(text) TO "user";
GRANT EXECUTE ON FUNCTION public.verify_token(text) TO "anonymous";
GRANT EXECUTE ON FUNCTION public.verify_token(text) TO "admin";

GRANT EXECUTE ON FUNCTION public.current_user_email() TO "user";
GRANT EXECUTE ON FUNCTION public.current_user_email() TO "admin";
