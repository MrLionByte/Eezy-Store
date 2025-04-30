# 🛒 Eezy-Store

**Eezy-Store** is a simple yet efficient eCommerce project built with scalability and extensibility in mind. Designed to be general-purpose and not bound to any specific product category, this project serves as a strong foundation for any eCommerce application — from shops to full-scale online stores.

---

## 📌 Features

### ✅ Core Functionality
- 🔐 User Authentication (JWT-based)
- 👥 User management
- 📦 Product & Order Management
- 🧾 Cart & Checkout Flow
- 💬 Product Ratings After Purchase
- 📍 Address Management

### 🖥️ Frontend
- Built with **React** + **Tailwind CSS** + **Shadcn**
- Modern, responsive UI
- Clean component architecture
- Integrated user & admin interfaces

### ⚙️ Backend
- Built with **Django REST Framework**
- RESTful API design
- Modular service-based structure
- Admin capabilities for managing orders, users, and products
- DB using PSQL
- Media using cloudinary

---

## 🚀 Extend It into a Full-Scale Platform

While Eezy-Store is intentionally kept minimal and clean, you can easily transform it into a full-fledged eCommerce solution by adding:
- 💳 **Payment Gateway Integration** (e.g., Stripe, Razorpay)
- 📧 **Email Notifications** (for orders, verification, etc.)
- 🔐 **OTP Authentication System**
- 📊 **Charts and Graphs** (to visualize sales, traffic, etc.)

---

## 📂 Project Structure

```bash
Eezy-Store/
├── backend/         # Django REST Framework project
│   └── ...
├── frontend/        # React app
│   └── ...
├── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- Python 3.9+
- PostgreSQL or SQLite (for local development)
- Node.js
- Vite (React setup)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/MrLionByte/Eezy-Store.git
cd Eezy-Store
```

2. **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
or gunicorn -w 4 eezy_store.wsgi:application
```

3. **Frontend Setup**

```bash
cd ../frontend
npm install
npm run dev
```

4. **Sample env**

```bash
Backend:
SECRET_KEY='your secret key'
ALLOWED_HOSTS='allowed host headers'
CORS_ALLOWED_ORIGINS='allowed origins'
DEBUG='True' if development, in production 'False'
EMAIL_USE_TLS=True
EMAIL_PORT=587 default
EMAIL_HOST_USER='your host email address'
EMAIL_HOST_PASSWORD='your host app password'
DATABASE_URL='any psql provider url'
cloudinary_cloud_name='get from cloudinary'
cloudinary_api_key='get from cloudinary'
cloudinary_api_secret='get from cloudinary'
cloudinary_secure=True default

Frontend:

```
VITE_API_URL='your backend url'
VITE_IMAGE_URL=http://res.cloudinary.com/ + 'your cloudinary_cloud_name'/
---

## 🧑‍💻 Contributing

Feel free to fork, contribute, or raise issues to improve the platform. Pull requests are welcome!

---

## 📃 License

This project is open-source and available under the [MIT License](LICENSE).
