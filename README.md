# 📝 RESTful Blogging API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
[![Postman](https://img.shields.io/badge/Postman-API%20Docs-orange?style=for-the-badge&logo=postman&logoColor=white)](https://postman.co/workspace/My-Workspace~fdab7c6d-792e-409f-837c-89de49038b32/request/43175015-dc10c136-626d-4c40-a2e0-32b7a87340bd?action=share&creator=43175015&ctx=documentation)

A full-stack blogging platform with a secure RESTful API backend (Node.js, Express, MongoDB) and a modern React frontend.

## 📖 API Documentation

**[View Full API Documentation on Postman →](https://postman.co/workspace/My-Workspace~fdab7c6d-792e-409f-837c-89de49038b32/request/43175015-dc10c136-626d-4c40-a2e0-32b7a87340bd?action=share&creator=43175015&ctx=documentation)**

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👤 **Role-based Access Control** - Admin and User roles
- 📝 **CRUD Operations** - Create, Read, Update, Delete blog posts
- 🖼️ **Image Upload** - Cover image support with Sharp for optimization
- 🛡️ **Security** - Helmet, rate limiting, and input validation
- 📄 **Pagination & Filtering** - Query posts with sorting and pagination

### Frontend Features

- ⚛️ **React 19** - Modern React with hooks
- ⚡ **Vite** - Lightning-fast development server and build tool
- 🎨 **Responsive UI** - Clean and intuitive user interface
- 🔐 **Authentication UI** - Login and signup forms with validation
- 📝 **Post Management** - Create, edit, and delete posts with image upload
- 🛡️ **Admin Panel** - User management for administrators
- 💾 **Persistent Sessions** - LocalStorage-based token management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Kiran-Kumar-K17/Scalable-REST-API-with-Authentication-Role-Based-Access.git
   cd calable-REST-API-with-Authentication-Role-Based-Access
   ```

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the backend directory:

   ```env
   PORT=8000
   DATABASE_URL=mongodb://localhost:27017/blogging-api
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   ```

4. **Start the backend server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The API will be running at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory** (from project root)

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:5173`

### Build for Production

```bash
# In the frontend directory
npm run build
npm run preview  # Preview production build
```

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication Endpoints

| Method | Endpoint        | Description                | Auth Required |
| ------ | --------------- | -------------------------- | ------------- |
| POST   | `/users/signup` | Register a new user        | No            |
| POST   | `/users/login`  | Login user                 | No            |
| GET    | `/users`        | Get all users (Admin only) | Yes (Admin)   |
| DELETE | `/users/:id`    | Delete a user (Admin only) | Yes (Admin)   |

### Posts Endpoints

| Method | Endpoint     | Description       | Auth Required |
| ------ | ------------ | ----------------- | ------------- |
| GET    | `/posts`     | Get all posts     | No            |
| GET    | `/posts/:id` | Get a single post | No            |
| POST   | `/posts`     | Create a new post | Yes           |
| PATCH  | `/posts/:id` | Update a post     | Yes (Owner)   |
| DELETE | `/posts/:id` | Delete a post     | Yes (Owner)   |

### Query Parameters (GET /posts)

| Parameter  | Description            | Example                |
| ---------- | ---------------------- | ---------------------- |
| `page`     | Page number            | `?page=1`              |
| `limit`    | Results per page       | `?limit=10`            |
| `sort`     | Sort field             | `?sort=-createdAt`     |
| `field`    | Select specific fields | `?field=title,content` |
| `category` | Filter by category     | `?category=Technology` |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to authenticate:

1. **Register or Login** to get a token
2. **Include the token** in the Authorization header:
   ```
   Authorization: Bearer <your-token>
   ```

### Example Request with Authentication:

```bash
curl -X POST http://localhost:8000/api/v1/posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"title": "My Post", "content": "Post content here"}'
```

## 📁 Project Structure

```
├── backend/
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── post.js              # Post CRUD operations
│   │   └── postController.js    # Image upload handling
│   ├── models/
│   │   ├── user.js              # User schema
│   │   └── post.js              # Post schema
│   ├── routes/
│   │   ├── user.js              # User routes
│   │   └── post.js              # Post routes
│   ├── utils/
│   │   └── asyncHandler.js      # Async error wrapper
│   ├── public/
│   │   └── image/posts/         # Uploaded images
│   ├── server.js                # Entry point
│   ├── MyDB.js                  # Database connection
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminPanel.jsx   # Admin user management
    │   │   ├── Auth.jsx         # Login/Signup forms
    │   │   ├── Message.jsx      # Toast notifications
    │   │   └── Posts.jsx        # Post listing & CRUD UI
    │   ├── App.jsx              # Main application component
    │   ├── App.css              # Application styles
    │   ├── main.jsx             # React entry point
    │   └── index.css            # Global styles
    ├── public/                  # Static assets
    ├── index.html               # HTML template
    ├── vite.config.js           # Vite configuration
    └── package.json
```

## 🛡️ Security Features

- **Helmet** - Sets security HTTP headers
- **Rate Limiting** - 100 requests per hour per IP
- **Password Hashing** - bcryptjs for secure password storage
- **Input Validation** - Mongoose validators and express validation
- **CORS** - Configured for cross-origin requests

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "results": 10,
  "data": [...],
  "pagination": {
    "totalPosts": 50,
    "currentPage": 1
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description here"
}
```

## 🧪 Testing with Postman

Import the included Postman collection (`postman_collection.json`) to test all endpoints.

## 🖥️ Frontend Components

### Auth Component

- **Login Form** - Email and password authentication
- **Signup Form** - User registration with name, email, password, and password confirmation
- **Form Toggle** - Switch between login and signup modes

### Posts Component

- **Post List** - View all blog posts with pagination
- **Create Post** - Form with title, content, category, tags, and cover image upload
- **Edit Post** - Modify existing posts (owners only)
- **Delete Post** - Remove posts with confirmation dialog
- **Refresh** - Reload posts from the API

### Admin Panel

- **User List** - View all registered users in a table
- **User Management** - Delete non-admin users
- **Role Display** - Visual badges for user roles

Made with ❤️ using Node.js, Express, React, and Vite
