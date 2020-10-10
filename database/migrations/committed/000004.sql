--! Previous: sha1:f7f0d28539621c03f4733ed6d3bd841ae8fe6815
--! Hash: sha1:0da1b9a46f16f3bf71f60ff8fcc54570800c116e

-- Fixes for trigger encrypt_password : Error code are not real error code
CREATE OR REPLACE FUNCTION encrypt_password() RETURNS TRIGGER AS
$func$
DECLARE
    password_length INT := LENGTH(NEW.password);
BEGIN
    IF NEW.password IS NULL THEN
        RAISE EXCEPTION 'Password cannot be null' USING ERRCODE = 'not_null_violation';
    END IF;

    IF password_length > 72 OR password_length < 6 THEN
        RAISE EXCEPTION 'Password length must be between 6 and 72 characters, % given', password_length USING ERRCODE = 'check_violation';
    END IF;

    NEW.password := crypt(NEW.password, gen_salt('bf'));
    RETURN NEW;
END
$func$ LANGUAGE plpgsql;
