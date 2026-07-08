CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers(
      id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  license_number VARCHAR(50),
  vehicle_model VARCHAR(100),
  vehicle_plate VARCHAR(20),
  vehicle_color VARCHAR(50),
  vehicle_year INT,
  is_available BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  approval_status VARCHAR(20) DEFAULT 'pending',
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_rides INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS signing_keys(
    id  UUID PRIMARY KEY,
    secret VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_drivers_id ON drivers(user_id);