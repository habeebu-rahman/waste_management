# ♻️ Waste Management System

A full-stack web application for managing waste collection and disposal, built with a **Django REST Framework** backend and a **React** frontend.

---

## 📁 Project Structure

```
waste_management/
├── accounts/            # User authentication & registration app
├── waste/               # Core waste management logic & API
├── waste_management/    # Django project settings & URL config
├── waste_frontend/      # React frontend (JavaScript)
├── manage.py            # Django management script
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | Python, Django, Django REST Framework |
| Frontend  | JavaScript, React                 |
| Database  | SQLite (default Django DB)        |

---

## 📦 Installed Modules / Dependencies

### 🐍 Backend (Python / Django)

Install these via `pip`:

```bash
pip install -r requirements.txt
```

| Package                  | Purpose                                      |
|--------------------------|----------------------------------------------|
| `django`                 | Core web framework                           |
| `djangorestframework`    | REST API support                             |
| `django-cors-headers`    | Allow cross-origin requests from React frontend |
| `pillow`                 | Image handling (if media uploads are used)   |

> **Note:** A `requirements.txt` file is not included in the repository. You may need to generate one with `pip freeze > requirements.txt` after setup.

---

### ⚛️ Frontend (JavaScript / React)

Located in the `waste_frontend/` directory. Install dependencies with:

```bash
cd waste_frontend
npm install
```

| Package         | Purpose                              |
|-----------------|--------------------------------------|
| `react`         | Core UI library                      |
| `react-dom`     | DOM rendering for React              |
| `react-scripts` | Create React App build tooling       |
| `axios`         | HTTP requests to Django REST API     |
| `react-router-dom` | Client-side routing               |

> Check `waste_frontend/package.json` for the full and exact list of dependencies.

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/habeebu-rahman/waste_management.git
cd waste_management
```

---

### 2. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install django djangorestframework django-cors-headers pillow

# Apply database migrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be running at: `http://127.0.0.1:8000/`

---

### 3. Frontend Setup

```bash
cd waste_frontend

# Install Node dependencies
npm install

# Start the React development server
npm start
```

The frontend will be running at: `http://localhost:3000/`

---

## 🔑 Django Apps

| App               | Description                                      |
|-------------------|--------------------------------------------------|
| `accounts`        | Handles user registration, login, and authentication |
| `waste`           | Core app — manages waste categories, requests, and data |
| `waste_management`| Project-level configuration, settings, and URL routing |

---

## 🌐 API Endpoints

The Django backend exposes RESTful API endpoints (served at `/api/`). Common endpoints include:

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/register/`     | User registration        |
| POST   | `/api/login/`        | User login               |
| GET    | `/api/waste/`        | List all waste records   |
| POST   | `/api/waste/`        | Create a new waste entry |
| GET    | `/api/waste/<id>/`   | Retrieve a specific entry|
| PUT    | `/api/waste/<id>/`   | Update a waste entry     |
| DELETE | `/api/waste/<id>/`   | Delete a waste entry     |

> Actual endpoint paths may vary. Refer to `waste_management/urls.py` and `waste/urls.py` for exact routing.

---

## 🔒 Authentication

User authentication is handled by the `accounts` app. The system uses Django's built-in authentication, extended with Django REST Framework token or session auth.

---

## 🛡️ CORS Configuration

Since the React frontend runs on a different port (3000) from Django (8000), `django-cors-headers` is used to allow cross-origin requests.

In `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

---

## 👤 Author

**Habeebu Rahman K C**
GitHub: [@habeebu-rahman](https://github.com/habeebu-rahman)

---

## 📄 License

This project is open source. Feel free to use and modify it.
