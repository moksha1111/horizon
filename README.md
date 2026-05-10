# Horizon — MERN travel-booking platform

> Full-stack travel booking app with search, availability, JWT auth, and a reservation flow.

**[Live demo →](#)**

![preview](docs/preview.png)

## What it does
A travel-booking platform where users can browse destinations, filter by date and party size, view stay details, and create authenticated reservations. Admins manage stays and reservations from a protected dashboard.

## Stack
- **Client:** React 18, Vite, Tailwind CSS v3, Axios, React Router
- **Server:** Node, Express, MongoDB (Mongoose), JWT, bcrypt

## Highlights
- Full auth flow with JWT and protected routes
- Search + filter pipeline against the `/stays` endpoint with availability awareness
- Reservation creation with conflict checks
- Admin dashboard for stay and reservation management
- Clean `/client` + `/server` workspace split

## Run locally
```bash
# 1. Backend
cd server
npm install
npm run dev          # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev          # http://localhost:5174
```

Set `MONGO_URI` and `JWT_SECRET` in `server/.env` first.
