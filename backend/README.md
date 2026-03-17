
# User Endpoints Documentation


  - Unexpected server error.

---

### Example Request

```
POST /users/login
Content-Type: application/json
  "email": "john.doe@example.com",
  "password": "securePassword123"
```

### Example Success Response

```
Status: 200 OK
{
  "user": {
    "_id": "...",
    "email": "john.doe@example.com"
    // ...other fields
  },
  "token": "...jwt token..."
}
```
  ## Register User
  ### Route: POST /users/register

- The email must be registered.
- The password is checked securely.
- On success, a JWT token is returned for authentication.

---


Send a JSON object with the following structure:
{
    "firstName": "string (min 3 chars, required)",
    "lastName": "string (min 3 chars, optional)"
  },
  "email": "string (valid email, required)",
}

### Fields
- `fullname.firstName` (string, required): User's first name (at least 3 characters)
- `email` (string, required): User's email address (must be valid and unique)
- `password` (string, required): User's password (at least 6 characters)
---


### Success
  ## Login User
  ### Route: POST /users/login
  - User registered successfully.
  - Response body:
    ```json
    {
      "user": { ...user fields... },
      "token": "JWT token string"
    }
    ```

- **400 Bad Request**
  - Invalid input data. Response body contains an array of error messages.
    ```json
    {
        { "msg": "Error message", "param": "field", ... }
    }
    ```
### Other Errors
- **500 Internal Server Error**
  - Unexpected server error.

---
  ## Get User Profile
  ### Route: GET /users/profile
## Example Request

```
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
}
```

## Example Success Response

```
Status: 201 Created
{
  ## Logout User
  ### Route: GET /users/logout
    "_id": "...",
    "fullname": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com"
    // ...other fields
  },
  "token": "...jwt token..."
}
```

---

## Notes
- All required fields must be present and valid.
- The email must be unique.
- The password is stored securely (hashed).
- On success, a JWT token is returned for authentication.
