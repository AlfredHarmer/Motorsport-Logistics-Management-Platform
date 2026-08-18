CREATE TABLE events (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  championship_season_id INTEGER NOT NULL
   REFERENCES championship_seasons(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  location_id INTEGER NOT NULL
   REFERENCES locations(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  CHECK (end_date >= start_date)
);
