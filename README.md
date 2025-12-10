# Creighton for Good – Developer Guide

This repository contains the CSC‑599 “Creighton for Good” prototype: a Spring Boot backend, a React frontend, and a MySQL schema packaged via Docker. The goal is to let campus teams publish surplus-food events and let students claim meals.

## Architecture at a Glance

| Layer | Tech | Notes |
| --- | --- | --- |
| Database | MySQL 8 (Docker) | Schema defined in `backend/src/main/resources/Script.sql`, mounted into the `creighton4good-mysql` container. |
| Backend API | Spring Boot 3, Spring Data JPA | Entities mirror the schema. `EventService` enforces org/location/user relationships before persisting. |
| Frontend | React 19 + Vite scripts | Talks to the backend at `http://localhost:8080/api/*`. Includes an honor-system login for Student vs Faculty dashboards. |

Key modules:

```
backend/
  src/main/java/backend/backend/entities      # JPA entities (Event, Location, etc.)
  src/main/java/backend/backend/events        # REST controller, DTOs, service logic
  src/main/resources                          # application properties + MySQL schema
frontend/
  src/App.js                                  # Single-page dashboard + faux auth
docker-compose.yml                            # Single MySQL service for local dev
```

## File Management & Structure

```
.
├── backend/                      # Spring Boot service and schema scripts
│   ├── mvnw, mvnw.cmd            # Maven wrapper entry points
│   ├── pom.xml                   # Backend dependencies + build plugins
│   ├── src/main/java/backend/
│   │   ├── backend/entities      # JPA entities mirrored from Script.sql
│   │   ├── backend/events        # Controllers, DTOs, services
│   │   └── backend/config        # Data initializer, CORS config, etc.
│   └── src/main/resources/
│       ├── application.properties# Datasource + JPA settings
│       └── Script.sql            # MySQL schema imported by Docker
├── frontend/                     # React + Vite single-page UI
│   ├── package.json              # Frontend dependencies/scripts
│   └── src/                      # App.js, components, faux auth helpers
├── docker-compose.yml            # MySQL container wiring for local dev
├── SkeletonERD.mwb               # MySQL Workbench ER diagram source
├── README.md                     # This guide; keep updated when structure shifts
└── backend-server.log            # Sample API log (safe to delete/regenerate)
```

Guidelines:

- Keep backend-only resources in `backend/` and frontend assets in `frontend/` to avoid leaking framework-specific configs across the stack.
- If you add new shared docs, store them at the repo root (next to this README) so both teams can find them.
- Generated artifacts such as build outputs or IDE metadata should stay ignored via `.gitignore`; avoid committing transient files into either subtree.

## Prerequisites

- Docker Desktop (or Docker Engine) for the MySQL container.
- Java 21 (ships with the Maven wrapper).
- Node 18+ and npm 9+ for the React app.

Helpful CLI tools: `make`, `jq`, `httpie`, though not required.

## Initial Setup

1. **Clone**
   ```bash
   git clone https://github.com/<org>/CSC-599-Creighton-For-Good-App.git
   cd CSC-599-Creighton-For-Good-App
   ```
2. **Start MySQL**
   ```bash
   docker compose up -d
   ```
   - Container name: `creighton4good-mysql`
   - Host port: `3308`
   - Loads `Script.sql` automatically the first time and seeds tables referenced by the entities.
3. **Install frontend dependencies (one-time)**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Running Locally

### Backend API

```bash
cd backend
./mvnw spring-boot:run
```

Environment defaults (see `backend/src/main/resources/application.properties`):

```
spring.datasource.url=jdbc:mysql://localhost:3308/creighton4good
spring.datasource.username=creighton_user
spring.datasource.password=pass123
```

When the API boots it:

1. Migrates the schema if needed (`spring.jpa.hibernate.ddl-auto=update`).
2. Seeds sample users/orgs/locations/events via `DataInitializer` if the DB is empty.

### Frontend

```bash
cd frontend
npm start
```

The React dev server proxies to `http://localhost:8080` for API calls. Use the honor-system login screen to select **Faculty / Staff** (full CRUD) or **Student** (read-only). Credentials are stored in `localStorage` only; there is no real authentication yet.

## Data Model Highlights

- `Event` ties together `Organization`, `Location`, and `User` (`created_by`). It owns `EventItem` children that track available portions.
- `EventService` (`backend/src/main/java/backend/backend/events/EventService.java`) validates:
  - Title, status, and start/end timestamps.
  - Location either by ID or by free-form name scoped to the chosen organization.
  - Default “created by” user when none is supplied.
  - Meal counts by syncing the first `EventItem`.
- Repositories use `@EntityGraph` so the frontend receives organization/location details in one call.

## Honorable Account Prototype

Because production authentication is still pending, the frontend offers a simple honor-system:

- Accounts are stored per role in `localStorage`.
- “Faculty / Staff” accounts unlock Create/Update/Delete buttons.
- “Student” accounts see the same cards but no management controls.

All API endpoints remain public right now; once we plug in real auth we can secure the backend with Spring Security role checks.

## Developer Tips

- To reset the DB, stop the container and remove the `mysql_data` volume:
  ```bash
  docker compose down -v
  docker compose up -d
  ```
- Maven wrapper caches dependencies under `~/.m2`. If you need a clean slate, nuke that folder.
- For a production build:
  ```bash
  cd backend && ./mvnw -DskipTests package
  cd ../frontend && npm run build
  ```

## License / Contributing

This is a course project; collaborate through pull requests and keep commits descriptive. When handing the repo to another team, point them to this README plus the inline comments in `EventService` and `App.js` for the latest architectural decisions.
