# User Registration Endpoint Documentation

## Endpoint

`POST /users/register`

Registers a new user in the system.

---

## Request Body

Send a JSON object with the following structure:

```
{
  "fullname": {
    "firstName": "string (min 3 chars, required)",
    "lastName": "string (min 3 chars, optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

### Fields
- `fullname.firstName` (string, required): User's first name (at least 3 characters)
- `fullname.lastName` (string, optional): User's last name (at least 3 characters if provided)
- `email` (string, required): User's email address (must be valid and unique)
- `password` (string, required): User's password (at least 6 characters)

---

## Responses

### Success
- **201 Created**
  - User registered successfully.
  - Response body:
    ```json
    {
      "user": { ...user fields... },
      "token": "JWT token string"
    }
    ```

### Validation Errors
- **400 Bad Request**
  - Invalid input data. Response body contains an array of error messages.
    ```json
    {
      "errors": [
        { "msg": "Error message", "param": "field", ... }
      ]
    }
    ```

### Other Errors
- **500 Internal Server Error**
  - Unexpected server error.

---

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
  "password": "securePassword123"
}
```

## Example Success Response

```
Status: 201 Created
{
  "user": {
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
