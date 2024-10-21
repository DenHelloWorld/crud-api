# CRUD API

A simple CRUD (Create, Read, Update, Delete) API for managing users, built with TypeScript and Node.js.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Response Codes](#response-codes)
- [Scripts](#scripts)
- [Technology Stack](#technology-stack)
- [License](#license)

## Features

- Create, read, update, and delete users.
- Simple and intuitive API structure.
- Handles various HTTP methods with appropriate responses.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DenHelloWorld/crud-api.git
cd crud-api
```

2. Install the dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and set the port:

```plaintext
PORT=4000
```

## Usage

To start the development server, run:

```bash
npm run start:dev
```
To start the production server, run:

```bash
npm run start:prod
```
To build the project for production, run:

```bash
npm run build
```

## API Endpoints
User Routes

 - GET /api/users - Retrieve all users
 - GET /api/users/:userId - Retrieve a user by ID
 - POST /api/users - Create a new user
 - PUT /api/users/:userId - Update an existing user by ID
 - DELETE /api/users/:userId - Delete a user by ID

## Response Codes

 - 200 OK - Successful operation
 - 201 Created - User successfully created
 - 204 No Content - User successfully deleted
 - 400 Bad Request - Invalid user ID or data
 - 404 Not Found - User not found

## Scripts

 - build: Build the project using webpack.
 - start:prod: Build and start the production server.
 - start:dev: Start the development server with TypeScript support using ts-node.

## Technology Stack

 - Node.js - JavaScript runtime for building the API.
 - TypeScript - For static typing and modern JavaScript features.
 - Webpack - Module bundler for building the project.


## License

This project is licensed under the ISC License.
