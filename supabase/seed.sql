-- seed.sql
-- Sample data so the Kudos feature is usable immediately on a fresh project.
-- Re-runnable: all inserts are conflict-safe.
--
-- Seeded profiles use FIXED reserved UUIDs (1111...) with is_seed = true so
-- they never collide with real auth.users ids (which are random v4 UUIDs).

-- ── Sample Sunners (recipient search / @mentions) ──────────────────────────
insert into public.profiles (id, email, full_name, avatar_url, is_seed) values
  ('11111111-1111-1111-1111-111111111101', 'nguyen.van.a@sun-asterisk.com', 'Nguyễn Văn An',  null, true),
  ('11111111-1111-1111-1111-111111111102', 'tran.thi.b@sun-asterisk.com',   'Trần Thị Bình',  null, true),
  ('11111111-1111-1111-1111-111111111103', 'le.van.c@sun-asterisk.com',     'Lê Văn Cường',   null, true),
  ('11111111-1111-1111-1111-111111111104', 'pham.thi.d@sun-asterisk.com',   'Phạm Thị Dung',  null, true),
  ('11111111-1111-1111-1111-111111111105', 'hoang.van.e@sun-asterisk.com',  'Hoàng Văn Em',   null, true),
  ('11111111-1111-1111-1111-111111111106', 'vo.thi.f@sun-asterisk.com',     'Võ Thị Phương',  null, true),
  ('11111111-1111-1111-1111-111111111107', 'dang.van.g@sun-asterisk.com',   'Đặng Văn Giang', null, true),
  ('11111111-1111-1111-1111-111111111108', 'bui.thi.h@sun-asterisk.com',    'Bùi Thị Hoa',    null, true)
on conflict (id) do nothing;

-- ── Predefined hashtags (the "+ Hashtag" dropdown) ─────────────────────────
insert into public.hashtags (label) values
  ('#Teamwork'),
  ('#Innovation'),
  ('#Leadership'),
  ('#Helpfulness'),
  ('#Quality'),
  ('#Ownership'),
  ('#CustomerFocus'),
  ('#Growth'),
  ('#Positivity'),
  ('#Reliability')
on conflict (label) do nothing;
