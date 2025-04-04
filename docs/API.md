[< Go back to main readme](../README.md#-api-documentation)

# 📘 API documentation

## 📑 Table of Contents

- #### [AuthController](#authcontroller)
  - [`POST /token`](#post-token)
- #### [HomeController (Test)](#homecontroller-test)
  - [`GET /open`](#get-open)
  - [`GET /`](#get-)
  - [`GET /secured`](#get-secured)
- #### [EmployeeController](#employeecontroller)
  - [`POST /management/employees`](#post-managementemployees)
  - [`DELETE /management/employees`](#delete-managementemployees)
  - [`PATCH /management/employees/role/grant`](#patch-managementemployeesrolegrant)
  - [`PATCH /management/employees/role/revoke`](#patch-managementemployeesrolerevoke)
- #### [AddUserController](#addusercontroller)
  - ...

---

## AuthController

#### **POST** `/token`
Returns JWT token in response

**Required permissions:** no authorization

**Request body:** `json`
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```
**Response:** `plain/text` containing a JWT token  
for example: `eyJraWQiOiJhN2EzNDIzMC0wNzMwLTQwODctODJkOS0wMGMwZ...`

**Returned errors:**
- `401 Unauthorized` - invalid credentials
- `400 Bad Request` - invalid request body

---

## HomeController (Test)

#### **GET** `/open`
Test of open endpoint without required authorization

**Required permissions:** no authorization

**Response:** `plain/text` containing a message

&nbsp;

#### **GET** `/`
Test endpoint without required authorization

**Required permissions:** any level of authorization

**Response:** `plain/text` containing a message with the name of the logged-in user

&nbsp;

#### **GET** `/secured`
Test endpoint with required _admin_ authorization

**Required permissions:** `ADMIN`

**Response:** `plain/text` containing a message

&nbsp;

---

## EmployeeController

#### **POST** `/management/employees`
Adding a new employee

**Required permissions:** `MANAGER`

**Request body:** `json`
```json
{
  "username": "string (required)",
  "password": "string (required)",
  "email": "string (required)",
  "name": "string (required)",
  "surname": "string (required)",
  "roles": "string[] (optional, default: ['EMPLOYEE'])"
}
```
**Response:** `json`
```json
{
  "message": "string",
  "data": "UserEntity"
}
```

**Returned errors:**
- `401 Unauthorized` - unauthorized access
- `403 Forbidden` - insufficient permissions
- `400 Bad Request` - invalid request body
- `409 Conflict` - user with the given username already exists

&nbsp;

#### **DELETE** `/management/employees`
Removing an employee by username

**Required permissions:** `MANAGER`

**Request params:**
- `username`: _string_ (required)

**Response:** `json`
```json
{
  "message": "string"
}
```

**Returned errors:**
- `401 Unauthorized` - unauthorized access
- `403 Forbidden` - insufficient permissions
- `400 Bad Request` - invalid query parameters
- `404 Not Found` - user with the given username does not exist

&nbsp;

#### **PATCH** `/management/employees/role/grant`
Granting a role to an employee

**Required permissions:** `MANAGER`

**Request params:**
- `username`: _string_ (required)
- `role`: _string_ (required)

**Response:** `json`
```json
{
  "message": "string",
  "data": "Role[]"
}
```

**Returned errors:**
- `401 Unauthorized` - unauthorized access
- `403 Forbidden` - insufficient permissions
- `400 Bad Request` - invalid query parameters
- `404 Not Found` - user with the given username does not exist

&nbsp;

#### **PATCH** `/management/employees/role/revoke`
Revoking a role from an employee

**Required permissions:** `MANAGER`

**Request params:**
- `username`: _string_ (required)
- `role`: _string_ (required)

**Response:** `json`
```json
{
  "message": "string",
  "data": "Role[]"
}
```

**Returned errors:**
- `401 Unauthorized` - unauthorized access
- `403 Forbidden` - insufficient permissions
- `400 Bad Request` - invalid query parameters
- `404 Not Found` - user with the given username does not exist

---

## AddUserController
...