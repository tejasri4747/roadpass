RoadPass demo server

How to run locally:

cd server
npm install
node index.js

API endpoints (demo):
- POST /api/auth/register {name,phone,password}
- POST /api/auth/login {phone,password}
- POST /api/upload (multipart form-data file)
- POST /api/bookings  (booking object)
- GET /api/bookings (requires Authorization: Bearer <token>)
- POST /api/reviews {vehicleId,name,rating,text}
- GET /api/invoice/:invoiceId
