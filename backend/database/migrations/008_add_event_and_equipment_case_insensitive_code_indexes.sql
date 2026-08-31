CREATE UNIQUE INDEX events_code_case_insensitive_unique
ON events (LOWER(code));

CREATE UNIQUE INDEX equipment_code_case_insensitive_unique
ON equipment (LOWER(code));
