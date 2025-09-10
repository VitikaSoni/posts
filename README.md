## Posts

[Demo Video](https://www.youtube.com/watch?v=K5o0xLJiKws)

### Tech stack

- React, Redux (Slice version), React Router, and Material UI.
- Node server with ExpressJS
- MongoDB for database

### Project Setup

Database

- `docker volume create mongodb_data`
- `docker compose up mongodb`

Backend

- `cd backend`
- `cp .env.example .env`
- Add your env vars in the `.env`
- `npm i`
- `npm run dev`

Frontend

- `cd frontend`
- `cp .env.example .env`
- Add your env vars in the `.env`
- `npm i`
- `npm run dev`

### Features

- Password hashing
- JWT + refresh token auth
- Route protection
- Role-based authorization
  - Admins can manage all posts
  - Regular users can only manage their own posts
- Sidebar for desktop and bottom bar for mobile and tablet
- MUI data-grid for posts
- Dialogs for operations on posts
- CRUD for posts
- Adding comments on posts (by any logged-in user)
- Responsive
