# Setup Instructions

This guide will help you get the project up and running on your local machine.

## Prerequisites

### Install Bun

Before you begin, you must install Bun (v1.3.0 or higher). Bun is a fast JavaScript runtime and package manager that is required for this project.

**Installation:**

If you already have npm installed:

```bash
npm install -g bun 
```

Or use the official installer:

```bash
# macOS and Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

For more installation options, visit [bun.sh](https://bun.sh)

After installation, verify it's working:

```bash
bun --version
```

### PostgreSQL Database

This project requires a PostgreSQL database to be running locally and accessible from the server.

**Requirements:**
- You must have connection credentials (username, password, database name)
- Create a database for this project using PostgreSQL commands or a GUI tool of your choice

## Setup Steps

### 1. Install Dependencies

From the root directory of the project, install all dependencies:

```bash
bun install
```

This will install dependencies for both the frontend and backend applications.

### 2. Create Environment Files

You need to create `.env` files for both applications.

**For the API (Backend):**

```bash
cp apps/api/.env.example apps/api/.env
```

**For the Frontend:**

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

After copying, **you must edit the `apps/api/.env` file** to configure your PostgreSQL connection:

```
DATABASE_URL="postgresql://username:password@localhost:5432/brigit_tech"
```

Replace `username`, `password`, and `brigit_tech` with your actual PostgreSQL credentials and database name.

### 3. Run the Development Servers

Start both the frontend and backend servers with a single command:

```bash
bun run dev
```

This will start:
- **Backend API** on `http://localhost:3003`
- **Frontend** on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the welcome page with instructions to view the tech stack guide.

## Additional Commands

- **Push database schema:** `bun run db:push` (after setting up your database)

**Note:** The `bun run dev` command automatically runs both the frontend and backend servers simultaneously, so there's no need to run them separately.


## Next Steps

After successfully running the project, visit the tech stack guide at:

```
http://localhost:3000/tech-stack
```

This will help you understand the technologies and patterns used in this project.
