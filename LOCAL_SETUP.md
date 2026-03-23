# Local Setup Guide for HISA-PEOPLES-CHAIN

This guide explains how to set up and run the HISA-PEOPLES-CHAIN project locally. The project consists of a Node.js backend and a Next.js frontend DApp.

## Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **Git**: To clone the repository.
- **npm** or **yarn**: For installing packages.

## 1. Backend Setup (`hisa-backend`)

The backend is a Node.js/Express application.

### Installation
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd hisa-backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Copy the example environment file to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and fill in your connection details (e.g., MongoDB URI, Hedera credentials, API keys).

### Running the Backend
- **Development Mode** (with auto-restart via nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```
- **Testing**:
  ```bash
  npm test
  ```

---

## 2. Frontend Setup (`front end/hisa-Dapp`)

The frontend is a Next.js application with Tailwind CSS and Genkit AI integration.

### Installation
1. Open a new terminal and navigate to the DApp directory:
   ```bash
   cd "front end/hisa-Dapp"
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration
1. If there is a `.env.example` in this folder, copy it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with the relevant configurations (e.g., RPC endpoints, backend URL).

### Running the Frontend
- **Development Mode** (runs on port 9002):
  ```bash
  npm run dev
  ```
- **Genkit AI Development Server** (optional):
  ```bash
  npm run genkit:dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

---

## 3. General Workflow
1. Start the **backend server** in one terminal window (`cd hisa-backend && npm run dev`).
2. Start the **frontend server** in a second terminal window (`cd "front end/hisa-Dapp" && npm run dev`).
3. Open a browser and navigate to `http://localhost:9002` to interact with the frontend.

## Common Issues
- **Port Conflicts**: If port `9002` is in use, Next.js will ask to run on another port. Ensure no other applications are using port `9002` or update the script in `package.json`.
- **Database Connection**: If the backend fails to start, verify your `.env` database connection string.
