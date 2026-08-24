CREATE UNIQUE INDEX locations_code_case_insensitive_unique
ON locations (LOWER(code));

CREATE UNIQUE INDEX championships_code_case_insensitive_unique
ON championships (LOWER(code));
