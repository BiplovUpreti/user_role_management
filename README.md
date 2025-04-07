# User Role Management System

A comprehensive user and role management application built with Angular and NgRx.

## Features

- User management (Create, Read, Update, Delete)
- Role management with permissions
- Authentication and authorization
- Responsive UI built with Ant-Design/NG-ZORRO components

## Prerequisites

- Node.js (v18 or later)
- Angular CLI (v19 or later)
- npm (v9 or later)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/user-role-management.git
```

## Configuration

1. The mock database is stored in db.json at the root of the project. This file contains:

   - Users data
   - Roles data
   - Permissions data

2. Start the JSON Server (runs on port 3000 by default):

```bash
npm run server
# or manually:
json-server --watch db.json --port 3000
```

## Development

To start both the Angular dev server and JSON Server concurrently:

```bash
npm run start:dev
```

This will:

- Start Angular on http://localhost:4200
- Start JSON Server on http://localhost:3000

## API Endpoints

The following endpoints are available via JSON Server:

- GET/POST/PUT/DELETE /users
- GET/POST/PUT/DELETE /roles
- GET /permissions
  You can directly access and modify the data through these endpoints or by editing the db.json file.
