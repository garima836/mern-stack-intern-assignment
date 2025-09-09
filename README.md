
MERN Intern Assignment - Scaffold
================================

Structure:
- backend/        Node.js + Express + Mongoose API
- frontend/       React app (simple, uses fetch)

Quick start (backend):
1. cd backend
2. npm install
3. Copy .env.example to .env and set MONGO_URI and JWT_SECRET
4. npm run dev    # if you have nodemon, or `npm start`

Quick start (frontend):
1. cd frontend
2. npm install
3. In development, set REACT_APP_API_BASE=http://localhost:5000 in .env if needed
4. npm start

Notes:
- The backend expects a MongoDB instance. You can use local MongoDB or MongoDB Atlas.
- The signup route creates user documents in the users collection. For student records, admin users should add student entities.
- For initial testing, create an admin by signing up with role=admin from the signup form.
- This scaffold focuses on authentication, role-based access, and basic dashboards. Optional features (email verification, password reset) are omitted but easy to add.
