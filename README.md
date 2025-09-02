# EduStream – Modern Online Learning Platform  

EduStream is a prototype online learning platform designed to deliver **interactive, multimedia-rich courses** with a focus on **scalability, security, and user experience**.  

This project demonstrates key features of EduStream, including **media playback, user preferences, authentication, real-time validation, dashboards, and backend integration**.  

---

## 🚀 Features  

- **🎥 Media Gallery & Playback Controls**  
  - Responsive media gallery for videos, audio, and images  
  - Custom overlays & visualizations with Canvas API  
  - Interactive playback controls using HTML5 media events  

- **🌙 User Preferences & Dark Mode**  
  - Dark mode toggle with Tailwind CSS  
  - Preferences stored locally (persistent across sessions)  

- **🔐 Authentication & Secure Purchases**  
  - JWT-based authentication with React  
  - Reusable shopping cart component for course purchases  
  - Secure checkout workflows  

- **⚡ Real-Time Validation**  
  - Interactive forms for sign-ups and quizzes  
  - HTML5 Constraint Validation API + JavaScript feedback  

- **📊 Dashboard & Analytics**  
  - User dashboards built with Tailwind + Headless UI  
  - Progress tracking, activity feed, and charts (analytics visualization)  

- **🗄 Backend Integration (Laravel + MongoDB)**  
  - REST API or SPA architecture (Inertia.js / API communication)  
  - Secure handling of courses, users, and orders  
  - Job queues for background tasks (emails, content processing)  

---

## 🛠 Tech Stack  

### Frontend  
- **React.js** – UI development  
- **Tailwind CSS** – Styling & dark mode support  
- **Headless UI** – Accessible UI components  
- **Canvas API + HTML5 Events** – Media visualizations & interactivity  

### Backend  
- **Laravel (PHP)** – API & business logic  
- **MongoDB** – Database for courses, users, and orders  
- **JWT (JSON Web Token)** – Authentication  
- **Job Queues** – Background processing (emails, uploads)  

---

## 📂 Project Structure  

```plaintext
edustream/
├── edustream-frontend/    # React frontend
│   ├── components/        # Reusable UI components
│   ├── pages/             # Routes (dashboard, courses, etc.)
│   └── utils/             # Helpers (auth, validation)
├── edustream-backend/     # Laravel backend
│   ├── app/               # Controllers, Models, Jobs
│   ├── routes/            # API routes
│   └── config/            # Environment settings
└── README.md              # Project documentation
```

---

## ⚙️ Installation & Setup  

### Prerequisites  
- Node.js (>= 18)  
- PHP (>= 8.1) with Composer  
- MongoDB (>= 6.0)  

### Steps  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/edustream.git
   cd edustream
   ```

2. **Setup frontend (React)**  
   ```bash
   cd edustream-frontend
   npm install
   npm run dev
   ```

3. **Setup backend (Laravel)**  
   ```bash
   cd edustream-backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan serve
   ```

   - .env file
   ```bash
  DB_CONNECTION=mongodb
  DB_DATABASE=edustream
  MONGO_DSN=YOUR_CONNCTION_url
   ```

4. **Run MongoDB**  
   ```bash
   mongod
   ```

---

## 🔒 Security Considerations  

- JWT for stateless authentication  
- Secure password hashing (bcrypt/argon2)  
- HTTPS enforcement (for production)  
- Input validation & sanitization  
- Role-based access control for users & admins  

---

## 📈 Scalability & Performance  

- Modular & reusable frontend components  
- Asynchronous job queues for heavy tasks  
- API-first architecture for flexibility  
- Optimized media streaming using HTML5 APIs  
- Caching strategies for frequently accessed data  

---

## 📊 Deliverables  

- ✅ Functional prototype with at least 4 feature areas  
- ✅ Detailed report on architecture & design choices  
- ✅ Documented codebase with setup instructions  
- ✅ (Optional) Demo video or live link  

---

## 🤝 Contributing  

Contributions, issues, and feature requests are welcome.  
Feel free to fork the repo and submit PRs.  

---

## 📜 License  

This project is licensed under the **MIT License**.  
