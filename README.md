<!-- @format -->

# DocAppoint Server

A clean Express backend starter for the DocAppoint project.

## Tech Stack

- Express.js
- CORS
- dotenv
- MongoDB driver
- nodemon

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create or update `.env`:

```bash
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

3. Run in development:

```bash
npm run dev
```

4. Run in production mode:

```bash
npm start
```

## Test

Open this URL in your browser:

```bash
http://localhost:5000
```

You should see a JSON response like:

```json
{
  "message": "DocAppoint backend running",
  "status": "ok"
}
```

## Folder Structure

```text
server/
├── .env
├── .gitignore
├── README.md
├── index.js
├── package-lock.json
├── package.json
└── src/
```
