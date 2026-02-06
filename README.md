# ClickUp Project

## Overview
This project is a full-stack template with a React frontend and Django backend. It supports user, project, and task management with JWT authentication.

---

## Backend (Django)

### Setup
1. Navigate to `backend/`.
2. Install dependencies:
	```
	pip install -r requirements.txt
	```
3. Run migrations:
	```
	python manage.py migrate
	```
4. Start server:
	```
	python manage.py runserver
	```

### API Endpoints
All endpoints are prefixed with `/api/v1/`.

#### Authentication
- Obtain JWT token: `POST /api/v1/token/`
- Refresh JWT token: `POST /api/v1/token/refresh/`

#### Users
- List Users: `GET /api/v1/users/` (admin only)
- Create User: `POST /api/v1/users/create/` (admin only)

#### Projects
- List Projects: `GET /api/v1/projects/`
- Project Detail: `GET /api/v1/projects/<project_id>`
- Create Project: `POST /api/v1/projects/create/`

#### Tasks
- Create Task: `POST /api/v1/projects/<project_id>/task/create/` (admin/manager only)

### Testing Endpoints with Postman
1. Obtain JWT Token:
	- URL: `POST http://localhost:8000/api/v1/token/`
	- Body:
	  ```json
	  {
		 "username": "your_username",
		 "password": "your_password"
	  }
	  ```
	- Copy `access` token from response.
2. Use Token for Authenticated Requests:
	- Set `Authorization` header: `Bearer <access_token>`
3. Example Requests:
	- List Users: `GET http://localhost:8000/api/v1/users/`
	- Create User: `POST http://localhost:8000/api/v1/users/create/`
	- List Projects: `GET http://localhost:8000/api/v1/projects/`
	- Project Detail: `GET http://localhost:8000/api/v1/projects/1`
	- Create Project: `POST http://localhost:8000/api/v1/projects/create/`
	- Create Task: `POST http://localhost:8000/api/v1/projects/1/task/create/`

---

## Frontend (React)

### Setup
1. Navigate to project root.
2. Install dependencies:
	```
	npm install
	```
3. Start frontend server:
	```
	npm start
	```
	- App runs at [http://localhost:3000](http://localhost:3000)

### Structure
- `src/components/`: Reusable UI components (Header, Footer, ProtectedRoute)
- `src/screens/`: Main screens (Dashboard, Login, Project/Task/User screens)
- `src/redux/`: Redux store and slices for state management
- `src/services/`: API service utilities

### Usage
- Login with your credentials to obtain a JWT token.
- All API requests from frontend use the backend endpoints described above.
- Only admins can create users; managers can create tasks for their assigned projects.

---

## Running Both Servers
- Backend: `python manage.py runserver` (default: port 8000)
- Frontend: `npm start` (default: port 3000)
- Ensure backend is running before using frontend for API calls.

---

## Troubleshooting
- 403 error: Check user role and token.
- 401 error: Token expired or missing.
- Backend not running: Start Django server.
- Frontend not running: Start React server.

---

## Contact
For questions, contact the project maintainer.

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
