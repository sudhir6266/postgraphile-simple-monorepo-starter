--! Previous: sha1:0da1b9a46f16f3bf71f60ff8fcc54570800c116e
--! Hash: sha1:47f1910bdba6ddf3b1086c64b702b3b278adcd8b

-- OMIT id on update / create
comment on column "user".id is '@omit create,update';

-- Filterable columns
comment on column "user".email is '@filterable';
comment on column "user".role is '@filterable';

-- Allow create user
grant all on sequence user_id_seq to admin;
grant all on sequence user_id_seq to "anonymous";
