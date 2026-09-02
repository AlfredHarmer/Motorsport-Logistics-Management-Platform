CREATE UNIQUE INDEX equipment_transfers_one_open_per_equipment_unique
ON equipment_transfers (equipment_id)
WHERE status IN ('planned', 'in_transit', 'diverted');
