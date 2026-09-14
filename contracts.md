# Kedia and Associates — Backend Contracts

## Auth (JWT, simple username+password)
- Admin creds from backend/.env: ADMIN_USERNAME, ADMIN_PASSWORD (default admin/admin123)
- POST /api/admin/login {username,password} -> {token, username}
- Protected routes require header: Authorization: Bearer <token>

## Inquiries
- POST /api/inquiries (public) body: {name,email,country_code,phone(10 digits),company,service,message}
- GET /api/inquiries (admin) -> list newest first
- DELETE /api/inquiries/{id} (admin)

## Services (image optional base64 data URI; icon = lucide name for seeded)
- GET /api/services (public) -> ordered list
- POST /api/services (admin) {title,desc,image?,icon?}
- PUT /api/services/{id} (admin)
- DELETE /api/services/{id} (admin)

## Expertise
- GET /api/expertise (public) -> ordered list
- POST /api/expertise (admin) {title,image?}
- PUT /api/expertise/{id} (admin)
- DELETE /api/expertise/{id} (admin)

## Seeding
- On startup, if collections empty, seed 12 services (with icon names) and 10 expertise from original site.

## Frontend integration
- src/api.js central axios calls using REACT_APP_BACKEND_URL + /api
- Services.jsx & Expertise.jsx fetch from API; render <img> if image present else lucide icon (iconMap.js) — falls back to mock.js on error.
- Contact.jsx: country_code Select + phone exactly 10 digits validation, POST to /api/inquiries.
- Routing: "/" -> Home, "/admin" -> Admin (login + tabs: Inquiries / Services / Expertise with image upload via base64).

## Mocked -> Real
- mock.js services/expertise now seeded in DB and served via API (mock kept as fallback only).
- Contact form now persists to DB.
