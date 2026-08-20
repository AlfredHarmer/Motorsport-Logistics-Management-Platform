CREATE TABLE equipment_transfers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_id INTEGER NOT NULL
     REFERENCES equipment(id) ON DELETE RESTRICT,
    origin_location_id INTEGER NOT NULL
     REFERENCES locations(id),
    destination_location_id INTEGER NOT NULL
     REFERENCES locations(id),
    related_event_id INTEGER REFERENCES events(id),
    planned_departure TIMESTAMPTZ NOT NULL,
    expected_arrival TIMESTAMPTZ NOT NULL,
    actual_departure TIMESTAMPTZ,
    is_delayed BOOLEAN NOT NULL DEFAULT FALSE,
    revised_expected_arrival TIMESTAMPTZ,
    revised_departure TIMESTAMPTZ,
    delay_reason TEXT,
    actual_arrival TIMESTAMPTZ,
    transport_method TEXT NOT NULL CHECK ( 
        transport_method IN ( 
            'air_freight', 
            'sea_freight',
            'road_freight_artic', 
            'team_transport', 
            'other'
        )
    ),
    status TEXT NOT NULL DEFAULT 'planned' CHECK ( 
        status IN (
            'in_transit', 
            'planned', 
            'arrived',
            'cancelled', 
            'diverted'
        )
    ),
    notes TEXT,
    CHECK (expected_arrival >= planned_departure),
    CHECK (
        actual_arrival IS NULL
        OR (
            actual_departure IS NOT NULL
            AND actual_arrival >= actual_departure
        )
    )
);