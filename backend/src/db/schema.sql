CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  intervention TEXT NOT NULL,
  result       TEXT NOT NULL,
  indicator    TEXT NOT NULL,
  years        JSONB NOT NULL DEFAULT '{}',
  color_class  TEXT NOT NULL,
  hex          TEXT NOT NULL,
  meta         INTEGER NOT NULL CHECK (meta BETWEEN 0 AND 100),
  ok_text      TEXT NOT NULL,
  ko_text      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS participants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        INTEGER NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  age         INTEGER NOT NULL CHECK (age BETWEEN 0 AND 99),
  program_id  TEXT NOT NULL REFERENCES programs(id),
  need        TEXT NOT NULL,
  weaknesses  TEXT NOT NULL,
  action      TEXT NOT NULL,
  level       TEXT NOT NULL DEFAULT 'Medio' CHECK (level IN ('Bajo','Medio','Alto')),
  achieved    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_participants_program ON participants(program_id);

CREATE TABLE IF NOT EXISTS attendance (
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  check_in       TIME,
  check_out      TIME,
  PRIMARY KEY (participant_id, date)
);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
