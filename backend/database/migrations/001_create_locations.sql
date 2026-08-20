CREATE TABLE locations (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (
        kind IN (
            'workshop', 
            'airport', 
            'seaport',
            'warehouse', 
            'racetrack', 
            'other'
        )
    ),
    city TEXT NOT NULL, 
    country TEXT NOT NULL
);