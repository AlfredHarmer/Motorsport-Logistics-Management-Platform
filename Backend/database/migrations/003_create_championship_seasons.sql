CREATE TABLE championship_seasons (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    championship_id INTEGER NOT NULL REFERENCES championships(id), 
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK (end_date >= start_date)
);