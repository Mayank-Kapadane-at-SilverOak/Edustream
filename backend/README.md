## EduStream Backend (Laravel)

Simple setup guide for the Laravel API used by EduStream.

### Prerequisites
- PHP 8.1+
- Composer
- MySQL/PostgreSQL/SQLite
- Node.js (optional; only if using Vite assets)

### Setup
1. Clone the repository and enter the backend folder:
   ```bash
   git clone <your-repo-url>
   cd edustream-backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install --no-interaction --prefer-dist --optimize-autoloader
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your local database credentials and app key.
4. Generate app key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
6. Serve the API:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://127.0.0.1:8000`.

### Common environment variables
Set the following in your `.env` (placeholders shown):
```env
APP_NAME=EduStream
APP_ENV=local
APP_KEY=base64:GENERATED_BY_ARTISAN
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=edustream
DB_USERNAME=your_user
DB_PASSWORD=your_password

QUEUE_CONNECTION=sync
CACHE_DRIVER=file
SESSION_DRIVER=file

# JWT / Auth
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` to version control. Use `.env.example` for placeholders only.

### API base URL for frontend
The frontend expects the API at `http://127.0.0.1:8000/api` by default. Adjust the frontend environment if your API URL differs.

### Testing
```bash
php artisan test
```

### Production
- Configure your web server to point to `public/`.
- Set secure values in `.env` and disable `APP_DEBUG`.
