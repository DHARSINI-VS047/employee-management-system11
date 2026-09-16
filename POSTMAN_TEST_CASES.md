# Postman API Test Suite - Employee Management System

This document outlines the standard test cases for validating the Django REST Framework API endpoints according to college SOP guidelines. It covers positive tests (valid payloads) and negative tests (boundary conditions, constraint violations, and missing fields).

**Base URL:** `http://127.0.0.1:8000/api`
**Common Header:** `Content-Type: application/json`

---

## Test Suite Summary Matrix

| Case ID | Feature / Action | HTTP Method | Endpoint URI | Expected Status | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | List All Employees | `GET` | `/employees/` | `200 OK` | Retrieve all employee records from SQLite |
| **TC-02** | Search by Name | `GET` | `/employees/?search=Rivera` | `200 OK` | Filter employees containing query in name/dept |
| **TC-03** | Filter by Department | `GET` | `/employees/?department=Engineering` | `200 OK` | Exact department match filter |
| **TC-04** | Create Employee (Valid) | `POST` | `/employees/` | `201 Created` | Insert new record with valid data |
| **TC-05** | Create Duplicate Email (Invalid) | `POST` | `/employees/` | `400 Bad Request` | Verify SQLite UNIQUE constraint |
| **TC-06** | Create Negative Salary (Invalid) | `POST` | `/employees/` | `400 Bad Request` | Verify MinValueValidator boundary |
| **TC-07** | Create Missing Required Fields | `POST` | `/employees/` | `400 Bad Request` | Verify NOT NULL constraints |
| **TC-08** | Retrieve by ID (Valid) | `GET` | `/employees/1/` | `200 OK` | Fetch single employee record by Primary Key |
| **TC-09** | Retrieve Non-Existent ID | `GET` | `/employees/9999/` | `404 Not Found` | Query invalid Primary Key |
| **TC-10** | Full Update (PUT Valid) | `PUT` | `/employees/1/` | `200 OK` | Update salary and department fields |
| **TC-11** | Delete Employee (Valid) | `DELETE` | `/employees/1/` | `200 OK` / `204 No Content` | Remove employee record |
| **TC-12** | Get Aggregated Stats | `GET` | `/employees/stats/` | `200 OK` | Custom ViewSet action for payroll metrics |

---

## Detailed Test Case Specifications

### TC-01: List All Employees
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/employees/`
- **Headers:** None
- **Expected Status:** `200 OK`
- **Expected Response Format:**
```json
[
  {
    "id": 1,
    "name": "Alex Rivera",
    "email": "alex.rivera@example.com",
    "department": "Engineering",
    "salary": "85000.00",
    "date_joined": "2023-01-15"
  }
]
```

---

### TC-02: Search & Query Filtering
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/employees/?search=Alex`
- **Expected Status:** `200 OK`
- **Validation:** Every item in the returned array must contain "Alex" in either name, department, or email.

---

### TC-03: Filter by Department
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/employees/?department=Engineering`
- **Expected Status:** `200 OK`
- **Validation:** Every item returned must have `"department": "Engineering"`.

---

### TC-04: Create Employee (Valid Data)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/employees/`
- **Headers:** `Content-Type: application/json`
- **Request Body (Valid JSON):**
```json
{
  "name": "Jordan Bell",
  "email": "jordan.bell@example.com",
  "department": "Design",
  "salary": 72500.00,
  "date_joined": "2024-03-01"
}
```
- **Expected Status:** `201 Created`
- **Expected Response Body:**
```json
{
  "message": "Employee created successfully.",
  "data": {
    "id": 6,
    "name": "Jordan Bell",
    "email": "jordan.bell@example.com",
    "department": "Design",
    "salary": "72500.00",
    "date_joined": "2024-03-01"
  }
}
```

---

### TC-05: Create Duplicate Email (Invalid - Database Constraint Check)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/employees/`
- **Headers:** `Content-Type: application/json`
- **Request Body (Duplicate Email):**
```json
{
  "name": "Imposter User",
  "email": "jordan.bell@example.com",
  "department": "Engineering",
  "salary": 60000.00,
  "date_joined": "2024-03-05"
}
```
- **Expected Status:** `400 Bad Request`
- **Expected Response Body:**
```json
{
  "email": [
    "An employee with this email address already exists."
  ]
}
```

---

### TC-06: Create with Negative Salary (Invalid - Validator Check)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/employees/`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Mark Miller",
  "email": "mark.miller@example.com",
  "department": "Finance",
  "salary": -5000.00,
  "date_joined": "2024-03-01"
}
```
- **Expected Status:** `400 Bad Request`
- **Expected Response Body:**
```json
{
  "salary": [
    "Salary must be a positive number greater than 0."
  ]
}
```

---

### TC-07: Create with Missing Required Fields (Invalid - NOT NULL Check)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/employees/`
- **Headers:** `Content-Type: application/json`
- **Request Body (Empty JSON):**
```json
{}
```
- **Expected Status:** `400 Bad Request`
- **Expected Response Body:**
```json
{
  "name": ["This field is required."],
  "email": ["This field is required."],
  "department": ["This field is required."],
  "salary": ["This field is required."]
}
```

---

### TC-08: Retrieve Single Employee by ID
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/employees/1/`
- **Expected Status:** `200 OK`

---

### TC-09: Retrieve Non-Existent Employee ID
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/employees/9999/`
- **Expected Status:** `404 Not Found`
- **Expected Response Body:**
```json
{
  "detail": "No Employee matches the given query."
}
```

---

### TC-10: Update Existing Employee (PUT)
- **Method:** `PUT`
- **URL:** `http://127.0.0.1:8000/api/employees/1/`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Alex Rivera",
  "email": "alex.rivera@example.com",
  "department": "Engineering",
  "salary": 95000.00,
  "date_joined": "2023-01-15"
}
```
- **Expected Status:** `200 OK`
- **Expected Response Body:**
```json
{
  "message": "Employee updated successfully.",
  "data": {
    "id": 1,
    "name": "Alex Rivera",
    "email": "alex.rivera@example.com",
    "department": "Engineering",
    "salary": "95000.00",
    "date_joined": "2023-01-15"
  }
}
```

---

### TC-11: Delete Employee
- **Method:** `DELETE`
- **URL:** `http://127.0.0.1:8000/api/employees/1/`
- **Expected Status:** `200 OK` (or `204 No Content`)
- **Expected Response Body:**
```json
{
  "message": "Employee 'Alex Rivera' (ID: 1) successfully deleted."
}
```

---

### TC-12: Aggregate Statistics Custom Action
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/employees/stats/`
- **Expected Status:** `200 OK`
- **Expected Response Body:**
```json
{
  "total_employees": 5,
  "total_payroll": 385000.00,
  "average_salary": 77000.00,
  "departments": [
    { "department": "Engineering", "count": 2, "avg_salary": 88500.00 },
    { "department": "Finance", "count": 1, "avg_salary": 78000.00 }
  ]
}
```
