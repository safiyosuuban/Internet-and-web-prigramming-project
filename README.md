# 🧑‍💻 Safiy Osuuban — Full-Stack Portfolio

A comprehensive full-stack personal portfolio web application built with **HTML5, CSS3, JavaScript, PHP, and MySQL** for the Internet and Web Programming course.

## 🚀 Live Demo
> Deploy to run locally via XAMPP

## ✨ Features

| Feature | Technology |
|---------|-----------|
| Responsive layout | CSS Grid + Flexbox |
| Dark/Light mode | JavaScript + Cookies |
| Typing animation | Vanilla JS DOM |
| Dynamic projects | AJAX + Fetch API |
| Contact form | JS Validation + PHP + MySQL |
| Admin dashboard | PHP Sessions + CRUD |
| Secure login | PDO + bcrypt + Session regeneration |

## 📁 Project Structure

```
portfolio/
├── index.html          ← Main portfolio
├── admin-login.html    ← Admin login
├── admin.html          ← Dashboard (CRUD)
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── main.js         ← All client-side logic
│   └── admin.js        ← Dashboard JS
├── php/
│   ├── config.php      ← PDO DB config
│   ├── projects.php    ← REST API
│   ├── contact.php     ← Form handler
│   ├── auth.php        ← Login/logout/check
│   └── messages.php    ← Admin messages API
└── sql/
    └── portfolio.sql   ← DB schema + seed data
```

## ⚙️ Setup

1. Import `sql/portfolio.sql` into MySQL
2. Update credentials in `php/config.php`
3. Serve from Apache/Nginx or XAMPP `htdocs/`
4. Visit `http://localhost/portfolio/`

**Admin:** `http://localhost/portfolio/admin-login.html`  
**Credentials:** `admin` / `admin123`

## 🛡️ Security
- PDO Prepared Statements (no SQL injection)
- `htmlspecialchars()` on all output (no XSS)
- `session_regenerate_id()` on login
- Brute-force lockout (5 attempts / 5 min)
- Rate-limited contact form (60s session cooldown)

## 🎓 Course
Internet and Web Programming — Full-Stack Portfolio Project
