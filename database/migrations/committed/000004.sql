--! Previous: sha1:179c9107e634ff6f4e5e5fe738a6ae3a5aa5772b
--! Hash: sha1:15c509bb9affd807ac6c1ae60e8ae3abbd65bf47

-- Enter migration here

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
