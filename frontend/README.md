## EduStream Frontend (React + Vite)

Simple setup guide for the EduStream frontend.

### Prerequisites
- Node.js 18+

### Setup
1. Enter the frontend folder:
   ```bash
   cd edustream-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set the API base URL.
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at the URL printed by Vite (usually `http://localhost:5173`).

### Notes
- The app expects a running backend API. See the backend README for setup.
- Do not commit your `.env`. Use `.env.example` for placeholders only.
