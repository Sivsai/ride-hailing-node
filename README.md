# Ride Hailing Backend

Microservices-based ride-hailing backend built with Node.js, PostgreSQL, Redis, and Stripe.

## Services
| Service | Port | Responsibility |
|---|---|---|
| Auth | 8081 | JWT auth with key rotation |
| Geo | 8082 | Redis geospatial driver matching |
| Rides | 8083 | Trip lifecycle FSM + surge pricing + payments |

## Architecture

Rider/Driver → Auth Service (login, JWT)
↓
Rides Service (request trip)
↓
Geo Service (find nearby drivers via Redis)
↓
Rides Service (FSM: requested→accepted→pickup→enroute→completed)
↓
Stripe (payment intent → confirm)

## Key Design Decisions
- **JWT Key Rotation** — signing keys stored in DB, rotated every 24hrs, `kid` header enables zero-downtime rotation
- **Redis GeoSpatial** — driver locations stored as geo index, radius search in O(N+log M)
- **FSM with invalid transition guard** — prevents illegal state jumps at service layer
- **Concurrency safe ride acceptance** — `WHERE status='requested' AND driver_id IS NULL` ensures only one driver wins
- **Surge pricing** — demand/supply ratio with 3x cap, calculated at trip completion
- **Non-blocking driver profile creation** — driver record failure doesn't fail registration

## Running Locally
\`\`\`bash
# Start dependencies
docker run --name ride-auth-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ride_hailing -p 5432:5432 -d postgres
docker run --name ride-geo-redis -p 6379:6379 -d redis

# Start services
cd auth-service && npm run dev
cd geo-service && npm run dev
cd rides-service && npm run dev
\`\`\`