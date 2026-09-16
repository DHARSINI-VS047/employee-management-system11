# Employee Management System (EMS) - College Project Documentation

A full-stack, production-grade web application developed for academic evaluation to manage organizational employee records. The system is designed with a decoupled architecture featuring a **Django REST Framework (DRF)** backend paired with an **SQLite** database, and a modern **React (Vite)** single-page application (SPA) styled with **Tailwind CSS**.

---

## 1. Project Overview & Objectives
The primary objective of this project is to provide a reliable, ACID-compliant, and user-friendly system for human resources and administrative teams to perform CRUD operations (Create, Read, Update, Delete) on employee data.

### Key Objectives:
- **Relational Data Integrity:** Enforce data models with database constraints including Primary Keys, Unique Email constraints, non-null fields, and domain check validators.
- **Decoupled Architecture:** Build independent frontend and backend services communicating strictly over RESTful JSON APIs.
- **Data Validation & Sanitization:** Implement dual-layer validation (client-side form guards and server-side DRF Serializer integrity checks).
- **Search & Filtering:** Provide rapid server-side query filters by employee name and business department.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Django / Django REST Framework | 4.2+ / 3.14+ | REST API, ORM, Serializer validation, and Routing |
| **Database** | SQLite 3 | Embedded | Relational ACID storage, zero-configuration local database |
| **Frontend Framework** | React (Vite) | 18+ / 19+ | Component-driven Single Page Application |
| **HTTP Client** | Axios | 1.6+ | Asynchronous REST communication & error interceptors |
| **Styling & UI** | Tailwind CSS | 3.4+ / 4+ | Utility-first responsive design and layouts |
| **Runtime Environments** | Python 3.10+ & Node.js 18+ | Latest LTS | Execution environments for backend and frontend |

---

## 3. Database Schema & Entity Specification

### Table Name: `employees` (in `db.sqlite3`)

| Column Name | SQL Data Type | Django ORM Field | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `BigAutoField` | `PRIMARY KEY AUTOINCREMENT` | Unique surrogate identifier |
| `name` | `VARCHAR(100)` | `CharField(max_length=100)` | `NOT NULL`, `BLANK=FALSE` | Full legal name of the staff member |
| `email` | `VARCHAR(255)` | `EmailField(max_length=255)` | `NOT NULL`, `UNIQUE` | Corporate email address (indexed) |
| `department` | `VARCHAR(50)` | `CharField(max_length=50)` | `NOT NULL`, `CHOICES` | Business department allocation |
| `salary` | `DECIMAL(10, 2)` | `DecimalField(10, 2)` | `NOT NULL`, `CHECK(salary > 0)` | Base salary amount with decimal precision |
| `date_joined` | `DATE` | `DateField` | `NOT NULL`, `DEFAULT=now` | Formal hire date (cannot be future) |

---

## 4. REST API Endpoint Specification

| HTTP Verb | Endpoint URI | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/employees/` | List all employees | `?search=`, `?department=`, `?name=` |
| **POST** | `/api/employees/` | Register new employee | None (JSON body required) |
| **GET** | `/api/employees/{id}/` | Retrieve single employee detail | None |
| **PUT** | `/api/employees/{id}/` | Full update of existing record | None (JSON body required) |
| **PATCH** | `/api/employees/{id}/` | Partial update of fields | None (JSON body required) |
| **DELETE** | `/api/employees/{id}/` | Remove employee record from DB | None |
| **GET** | `/api/employees/stats/` | Aggregated payroll & department metrics | None |

---

## 5. Step-by-Step Installation & Execution Guide

### Prerequisites
- **Python 3.10 or higher** (`python --version`)
- **Node.js 18 or higher & npm** (`node --version`, `npm --version`)
- **Git** (optional, for version tracking)

---

### Step A: Backend Setup (Django + SQLite)

1. **Clone or navigate to the project directory:**
   ```bash
   cd ems_project/backend
   ```

2. **Create and activate a Python virtual environment:**
   ```bash
   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install backend dependencies:**
   ```bash
   pip install django djangorestframework django-cors-headers
   # Or using requirements.txt:
   pip install -r requirements.txt
   ```

4. **Apply SQLite Database Migrations:**
   ```bash
   # Generates schema migration files
   python manage.py makemigrations employees

   # Executes DDL to create db.sqlite3 and 'employees' table
   python manage.py migrate
   ```

5. **(Optional) Create Django Superuser for visual Admin portal:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the Django Development Server:**
   ```bash
   python manage.py runserver 8000
   ```
   The backend will be running at **`http://127.0.0.1:8000/`**.
   - Browsable API: `http://127.0.0.1:8000/api/employees/`
   - Admin Dashboard: `http://127.0.0.1:8000/admin/`

---

### Step B: Frontend Setup (React + Vite)

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd ems_project/frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   npm install axios
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env` file in the frontend root:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

4. **Launch the Vite Development Server:**
   ```bash
   npm run dev
   ```
   The frontend will be accessible at **`http://localhost:5173/`**.

---

## 6. Testing & Demonstration Workflow
1. Open `http://localhost:5173` in your web browser.
2. Fill out the **Add New Employee** form and click **Save Employee**. Verify the record appears immediately in the table.
3. Attempt to add another employee with the **same email address** to demonstrate database and serializer uniqueness enforcement (HTTP 400 validation error).
4. Enter search terms in the search bar or pick a department filter to showcase dynamic server-side querying.
5. Click **Edit** on a row to populate the form in update mode, modify the salary, and submit.
6. Click **Delete** and confirm removal to verify the HTTP 200/204 deletion cycle.
