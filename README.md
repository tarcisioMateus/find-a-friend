# Find a Friend API

The Find a Friend API is a RESTful backend built with Node.js, TypeScript, and Fastify. It enables organizations to register, manage pets for adoption, and allows users to search for pets based on various criteria. The project utilizes Prisma for database interactions with PostgreSQL (managed via Docker) and includes comprehensive unit and E2E tests powered by Vitest.

## 🚀 Technologies Used
This project leverages a powerful and modern stack to ensure scalability, maintainability, and developer experience:

Node.js: JavaScript runtime environment.

TypeScript: Strongly typed superset of JavaScript for better code quality and maintainability.

- Fastify: A fast and low-overhead web framework for Node.js.

- Prisma: A modern database toolkit (ORM) for type-safe database access and migrations.

- PostgreSQL: A powerful, open-source relational database.

- Vitest: A blazing fast unit test framework powered by Vite.

- Supertest: A library for testing HTTP servers.

- Zod: TypeScript-first schema declaration and validation library.

## Environment Variables
Create a .env file in the root of your project based on .env.example (if provided), and fill in the necessary details, especially your PostgreSQL connection string.


## Run

To get the application running locally, ensure you have Node.js and Docker installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the PostgreSQL database via Docker Compose
docker-compose up -d postgres

# 3. Apply Prisma database migrations
npx prisma migrate dev --name init

# 4. Start the Fastify development server
npm run dev
