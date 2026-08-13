# ⭐ Store Rating Platform

A full-stack web application that allows users to discover stores and submit ratings. The application has different features and access levels depending on the user's role.

## 👥 User Roles

The application supports three types of users:

- **System Administrator** – Manages users, stores, and the overall platform.
- **Normal User** – Can register, browse stores, and submit ratings.
- **Store Owner** – Can view ratings and manage information related to their store.

All users use the same login system, with access controlled according to their role.

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- JavaScript
- HTML & CSS

### Backend
- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication

### Database
- PostgreSQL

## 📁 Project Structure

```text
store-rating-app/
│
├── backend/       # Express API, authentication and database models
├── frontend/      # React + Vite frontend application
└── README.md
```

## 🚀 Getting Started

Follow the steps below to run the project on your computer.

### 1. Clone the Repository

```bash
git clone https://github.com/akshu0029/store-rating-app.git
cd store-rating-app
```

### 2. Set Up the Database

Make sure PostgreSQL is installed and running.

Create a database named:

```sql
CREATE DATABASE store_rating_db;
```

### 3. Set Up the Backend

Open the backend folder:

```bash
cd backend
```

Install the required packages:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Open `.env` and add your PostgreSQL database details and JWT secret.

Then run the database seed:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The backend will normally be available at:

```text
http://localhost:5000
```

### 4. Set Up the Frontend

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

Make sure **both the frontend and backend servers are running** while using the application.

## 🔐 Default Admin Account

The seed script creates an initial administrator account:

```text
Email: admin@storerating.com
Password: Admin@1234
```

For security, change the password after your first login.

## 🔑 How the Roles Work

### Administrator

The administrator can:

- View the dashboard
- Create and manage users
- Create stores
- Create additional administrator accounts
- Assign store owners to stores

### Normal User

Normal users can:

- Create an account
- Log in
- Browse available stores
- Submit ratings from 1 to 5

### Store Owner

Store owners are created by an administrator.

They can:

- Log in using their assigned credentials
- View their store information
- View ratings submitted by users

## 🌐 Main API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| PUT | `/api/auth/update-password` | Logged-in users |
| GET | `/api/admin/dashboard` | Admin |
| POST | `/api/admin/users` | Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/users/:id` | Admin |
| POST | `/api/admin/stores` | Admin |
| GET | `/api/admin/stores` | Admin |
| GET | `/api/stores` | Normal User |
| POST | `/api/stores/:storeId/rating` | Normal User |
| GET | `/api/owner/dashboard` | Store Owner |

## ✅ Validation Rules

The application validates user input on both the frontend and backend.

- **Name:** 20–60 characters
- **Address:** Maximum 400 characters
- **Password:** 8–16 characters
- Password must contain at least **one uppercase letter**
- Password must contain at least **one special character**
- **Email:** Must follow a valid email format
- **Rating:** Must be an integer between **1 and 5**

## 📌 Notes

The application uses Sequelize to automatically create the required database tables when the backend starts, so manual database migrations are not required for the initial setup.

## 🎯 Project Purpose

This project demonstrates a complete full-stack application with:

- Role-based authentication
- User registration and login
- Store management
- Store ratings
- PostgreSQL database integration
- REST APIs
- React frontend
- JWT-based authentication

It is a good project for understanding how a frontend, backend, authentication system, and database work together in a real-world application.
