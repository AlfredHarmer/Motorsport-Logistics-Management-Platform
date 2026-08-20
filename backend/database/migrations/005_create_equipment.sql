CREATE TABLE equipment (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ( 
        'pit_stop_rig',
        'garage_pneumatics',
        'fueling',
        'personnel',
        'engineering',
        'other'
        )
    ),
    current_location_id INTEGER NOT NULL
     REFERENCES locations(id) ON DELETE RESTRICT,
    condition_status TEXT NOT NULL DEFAULT 'available' CHECK (
        condition_status IN (
            'available', 
            'under_service', 
            'out_of_service'
        )
    ),
    notes TEXT
);