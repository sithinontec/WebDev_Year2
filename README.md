# NaiRarm Bookshop

**ITCS223 Introduction to Web Development — Project Phase II**

A web application for an online bookshop featuring front-end pages with HTML/CSS/JavaScript and back-end services with Node.js.

---

## Team Information

- **Section**: 3
- **Group**: 4
- **Team Name**: NaiRarm

---

## Project Structure

```
├── Front-end/          # Front-end source files
│   ├── index.html            # Homepage
│   ├── login.html            # Admin login page
│   ├── search.html           # Book search page
│   ├── detail.html           # Book detail page
│   ├── admin.html            # Admin management page
│   ├── team.html             # Team information page
│   ├── image/                # The image of each members
│   │   ├── 6788017.png
│   │   ├── 6788088.png
│   │   ├── 6788128.png
│   │   └── 6788175.png
│   └──  css/
│       └── main.css          # Main stylesheet
│
├── Back-end/          # Web service source files
│   ├── server.js             # Main Express server
│   ├── .env.example          # Example environment variables (copy to .env)
│   ├── .env                  # Local environment (not for public repo)
│   ├── package.json          # Node.js dependencies
│   ├── config/
│   │   └── db.js             # Database configuration
│   └── routes/
│       ├── auth.js           # Authentication routes
│       └── books.js          # Book CRUD routes
│
├── sec3_gr4_database.sql     # MySQL database schema
└── README.md                 # This file
```

---

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- MySQL (optional - simulated DB included)

### Step 1: Setup Back-end Server

```bash
# Navigate to web service directory
cd Back-end

# Install dependencies
npm install

# Start the server
npm start

# Server will run on http://localhost:3000
```

Before starting the server, create a local `.env` file from the example and update values as needed:

```bash
cd Back-end
copy .env.example .env   # Windows (PowerShell/CMD)
# or
cp .env.example .env     # macOS / Linux
# then edit Back-end/.env and set your DB credentials and secrets
```

### Step 2: Setup Front-end Server

**Option A: Using VS Code Live Server**
1. Open the `Front-end` folder in VS Code
2. Install "Live Server" extension
3. Right-click on `index.html` → "Open with Live Server"
4. Front-end will run on http://localhost:5500

**Option B: Using Node.js http-server**
```bash
# Install http-server globally
npm install -g http-server

# Navigate to front-end directory
cd Front-end

# Start the server
http-server -p 5500

# Front-end will run on http://localhost:5500
```

### Step 3: (Optional) Setup MySQL Database

If you want to use real MySQL instead of simulated data:

```bash
# Login to MySQL
mysql -u root -p

# Run the SQL schema
source sec3_gr4_database.sql;

# Update database credentials in .env.
```

---

## Running the Application

1. Start the back-end server (port 3000)
2. Open the website. (Live-Server Extension in VS code)


### Test Credentials

- **Username**: `Ludwighandsome`
- **Password**: `12345678`
---
- **Username**: `admin`
- **Password**: `admin123`
---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin authentication |
| GET | `/api/books` | Search books (supports ?title=&author=&genre=) |
| GET | `/api/books/:id` | Get single book by ID |
| POST | `/api/books` | Add new book (admin) |
| PUT | `/api/books/:id` | Update book (admin) |
| DELETE | `/api/books/:id` | Delete book (admin) |

### Testing with Postman

Each endpoint has test cases documented in the source code comments. Import the following example:

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "Ludwighandsome",
  "password": "12345678"
}
```

```
POST http://localhost:3000/api/books
Content-Type: application/json

{
  "isbn": "9780452284234",
  "title": "1984",
  "author": "George Orwell",
  "price": 149,
  "genre": "Classics, Science Fiction, Politics",
  "publisher": "Arrow Classic Books",
  "pub_date": "1948-11-04",
  "synopsis": "A masterpiece of rebellion and imprisonment where war is peace freedom is slavery and Big Brother is watching."
}
```
---

## Features

### Front-end Pages
- ✅ Homepage with navigation and book showcase
- ✅ Login page for administrators
- ✅ Search page with 3 criteria (title, author, genre)
- ✅ Detail page showing book information
- ✅ Admin page for CRUD operations
- ✅ Team page with member information

### Back-end Services
- ✅ Authentication service
- ✅ Book search with multiple criteria
- ✅ Insert/Update/Delete operations
- ✅ CORS enabled for front-end connection

### Technical Requirements
- ✅ Semantic HTML elements (header, nav, main, article, footer)
- ✅ External CSS with element, class, and ID selectors
- ✅ JavaScript Fetch API for web service interaction
- ✅ Node.js/Express back-end
- ✅ MySQL database schema (with simulated option)

---

## Public Web Service Integration

This project integrates with the **Open Library Covers API** for book cover images:
- URL: `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`
- Used to display book covers on search and detail pages

