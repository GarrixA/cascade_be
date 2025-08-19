# CASCADE Serverside

This is the backend API for the cascade.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Organizations](#organizations)
- [Categories](#categories)
- [Products](#products)
- [Replies](#replies)
- [Roles](#roles)

---

## Authentication

### Register

- **POST** `/api/v1/auth/register`
- Registers a new user and sends a verification email.

### Login

- **POST** `/api/v1/auth/login`
- Logs in a user. If the user is an SELLER, sends a 2FA email.

### Account Verification

- **GET** `/api/v1/users/account/verify/:token`
- Verifies a user's email using the token sent via email.

### Two Factor Authentication

- **POST** `/api/v1/auth/2fa/:token`
- Verifies OTP for SELLER login.

---

## Users

### Get All Users

- **GET** `/api/v1/users`
- Returns all users (excluding passwords).

### Get User by ID

- **GET** `/api/v1/users/:id`
- Returns a single user by ID.

### Update User

### Assign Organization to User

- **PATCH** `/api/v1/users/:userId/assign-organization`
- Assigns an organization to an SELLER user.

---

## Organizations

### Create Organization

- **POST** `/api/v1/organizations`
- Creates a new organization.

### Get All Organizations

- **GET** `/api/v1/organizations`
- Returns all organizations.

### Get Organization by ID

- **GET** `/api/v1/organizations/:id`
- Returns a single organization by ID.

### Update Organization

- **PATCH** `/api/v1/organizations/:id`
- Updates organization information.

### Delete Organization

- **DELETE** `/api/v1/organizations/:id`
- Deletes an organization.

### Assign Organization to Product

- **PATCH** `/api/v1/products/:productId/assign-organization`
- Assigns an organization to a product based on category match and sets status to `processing`.

---

## Categories

### Create Category

- **POST** `/api/v1/categories`
- Creates a new category.

### Get All Categories

- **GET** `/api/v1/categories`
- Returns all categories.

### Get Category by ID

- **GET** `/api/v1/categories/:id`
- Returns a single category by ID.

### Update Category

- **PATCH** `/api/v1/categories/:id`
- Updates category information.

### Delete Category

- **DELETE** `/api/v1/categories/:id`
- Deletes a category.

---

## Products

### Create Product

- **POST** `/api/v1/products`
- Creates a new product. Requires a valid `categoryId`.

### Get All Products

- **GET** `/api/v1/products`
- Returns all products.

### Get Products by Organization

- **GET** `/api/v1/productsorg/organization`
- Returns products for the authenticated user's organization.

### Get Single Product by Organization

- **GET** `/api/v1/productsorg/organization/:id`
- Returns a single product by ID for the authenticated user's organization.

### Get Product by ID

- **GET** `/api/v1/products/:id`
- Returns a single product by ID.

---

## Replies

### Create Reply

- **POST** `/api/v1/replies`
- Creates a reply to a product. The reply owner is set from the authenticated user. Only allowed if the product belongs to the user's organization.

---

## Roles

### Get All Roles

- **GET** `/api/v1/roles`
- Returns all roles.

---

## Notes

- All endpoints requiring authentication expect an `Authorization: Bearer <token>` header.
- Some endpoints require admin privileges.
- For more details, see the OpenAPI/Swagger documentation in the `/src/documantation` folder.

---
