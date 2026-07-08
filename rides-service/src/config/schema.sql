CREATE TABLE IF NOT EXISTS trips(
id UUID PRIMARY KEY,
rider_id UUID NOT NULL,
driver_id UUID,
status VARCHAR(20) DEFAULT 'requested',
-- requested->accepted->pickup->enroute->completed->cancelled
start_lat DECIMAL(9,6),
start_long DECIMAL(9,6),
end_lat DECIMAL(9,6),
end_long DECIMAL(9,6),
fare DECIMAL(10,2),
started_at TIMESTAMP,
ended_at TIMESTAMP,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_rider ON trips(rider_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
