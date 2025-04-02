# A-system-supporting-hotel-services

## Opis endpointów

---

### AuthController

#### **POST** `/token`
Zwraca token JWT w odpowiedzi

**Wymaganie uprawnienia:** bez autoryzacji

**Request body:** `json`
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```
**Response:** `plain/text` zawierający token JWT

**Zwracane błędy:**
- `401 Unauthorized` - niepoprawne dane logowania
- `400 Bad Request` - niepoprawne dane wejściowe

---

### HomeController (Testowy)

#### **GET** `/open`
Test otwartego endpointu bez wymaganej autoryzacji

**Wymaganie uprawnienia:** bez autoryzacji

**Response:** `plain/text` zawierający wiadomość

&nbsp;

#### **GET** `/`
Test endpointu z wymaganą autoryzacją autoryzacji

**Wymaganie uprawnienia:** dowolny poziom autoryzacji

**Response:** `plain/text` zawierający wiadomość z nazwą zalogowanego użytkownika

&nbsp;

#### **GET** `/secured`
Test endpointu z wymaganą rolą admina

**Wymaganie uprawnienia:** `ADMIN`

**Response:** `plain/text` zawierający wiadomość

&nbsp;
---

### EmployeeController

#### **POST** `/management/employees`
Dodawanie nowego pracownika

**Wymaganie uprawnienia:** `MANAGER`

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

**Zwracane błędy:**
- `401 Unauthorized` - nieuprawniony dostęp
- `400 Bad Request` - niepoprawne dane wejściowe
- `409 Conflict`, użytkownik o podanej nazwie użytkownika już istnieje

&nbsp;

#### **DELETE** `/management/employees`
Usuwanie pracownika po nazwie użytkownika

**Wymaganie uprawnienia:** `MANAGER`

**Request params:**
- `username`: _string_ (required)

**Response:** `json`
```json
{
  "message": "string"
}
```

**Zwracane błędy:**
- `401 Unauthorized` - nieuprawniony dostęp
- `400 Bad Request` - niepoprawne parametry
- `404 Not Found`, użytkownik o podanej nazwie użytkownika nie istnieje

&nbsp;

#### **PATCH** `/management/employees/role/grant`
Przyznanie roli dla pracownika

**Wymaganie uprawnienia:** `MANAGER`

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

**Zwracane błędy:**
- `401 Unauthorized` - nieuprawniony dostęp
- `400 Bad Request` - niepoprawne parametry
- `404 Not Found`, użytkownik o podanej nazwie użytkownika nie istnieje

&nbsp;

#### **PATCH** `/management/employees/role/revoke`
Odebranie roli pracownikowi

**Wymaganie uprawnienia:** `MANAGER`

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

**Zwracane błędy:**
- `401 Unauthorized` - nieuprawniony dostęp
- `400 Bad Request` - niepoprawne parametry
- `404 Not Found`, użytkownik o podanej nazwie użytkownika nie istnieje
- 
---

### AddUserController
...