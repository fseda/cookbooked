insert into user_status (id) values 
  ('active'),
  ('inactive'),
  ('suspended');

insert into oauth_providers (id, active) values
  ('github', true),
  ('google', true);

insert into levels (id) values
  ('begginer'),
  ('apprentice'),
  ('cook'),
  ('chef'),
  ('master chef');