# Full-Stack Web Portfolio — Project Report

**Student:** Safiy Osuuban  
**Course:** Internet and Web Programming  
**Repository:** https://github.com/safiyosuuban/Internet-and-web-prigramming-project  
**Submission:** Full-Stack Portfolio Web Application

---

## 1. Project Overview

This is a comprehensive, full-stack personal portfolio web application that integrates all technologies covered throughout the semester: HTML5, CSS3, JavaScript, PHP, and MySQL. The portfolio serves as both an academic submission and a professional asset for career development.

---

## 2. Technical Architecture

### File Structure
```
portfolio/
├── index.html           ← Main portfolio page
├── admin-login.html     ← Admin login (session/cookie auth)
├── admin.html           ← Admin dashboard (CRUD interface)
├── css/
│   ├── style.css        ← Main stylesheet (responsive, custom variables)
│   └── admin.css        ← Admin-specific styles
├── js/
│   ├── main.js          ← Client-side JS (DOM, AJAX, validation)
│   └── admin.js         ← Admin dashboard JS (CRUD via AJAX)
├── php/
│   ├── config.php       ← PDO database configuration
│   ├── projects.php     ← RESTful projects API (GET/POST/PUT/DELETE)
│   ├── contact.php      ← Contact form handler (validates & saves to DB)
│   ├── auth.php         ← Session-based authentication (login/logout/check)
│   └── messages.php     ← Admin messages API (list/mark-read/delete/stats)
└── sql/
    └── portfolio.sql    ← Full DB schema + seed data
```

---

## 3. Feature Implementation

### 3.1 Semantic HTML & Advanced CSS
- **Semantic tags:** `<nav>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<main>` used throughout
- **HTML Tables:** Used in admin dashboard for messages and projects display
- **HTML Forms:** Contact form with full field set; admin login form; project CRUD modal form
- **Responsive Design:** CSS Grid and Flexbox used for all layouts; fully mobile-responsive
- **External Stylesheets:** Two separate CSS files (`style.css`, `admin.css`); consistent design token system via CSS Custom Properties (`--accent`, `--bg`, `--font-display`, etc.)
- **Custom fonts:** Google Fonts — Playfair Display (display/headings) + DM Sans (body) + DM Mono (code/labels)

### 3.2 Client-Side Interactivity (JavaScript/DOM)
- **Dark/Light Mode Toggle:** Reads/writes a cookie (`theme=dark|light`); applies class to `<body>`; persists across sessions
- **Typing Effect:** Animated role text in the hero section cycles through titles using `setTimeout` loops
- **Animated Skill Bars:** `IntersectionObserver` triggers CSS width transitions when the skills section scrolls into view
- **Scroll Reveal:** `IntersectionObserver` adds `.visible` class to `.reveal` elements on scroll
- **Active Nav Highlighting:** Section observer updates active nav link as user scrolls
- **Mobile Hamburger Menu:** Toggle with animated icon transformation (CSS + classList)
- **Form Validation:** Real-time validation on `blur` and `input` events; validates name length, email format (regex), subject length, message length; shows inline error messages; prevents submission if invalid
- **DOM Manipulation:** Projects grid rebuilt on category filter; filter tabs update `aria-selected`; modal opens/closes dynamically; admin stat cards update from AJAX responses

### 3.3 Server-Side Logic & Database (PHP/MySQL)
- **Contact Management:** `contact.php` validates server-side with rate limiting (session-based: 60s cooldown), then inserts into `messages` table via PDO prepared statements
- **Dynamic Content:** Projects are fetched from MySQL and rendered into the DOM — no hardcoded HTML project cards
- **RESTful API:** `projects.php` supports GET (list/single), POST (create), PUT (update), DELETE — HTTP method override via `?_method=` for browser compatibility
- **PDO Prepared Statements:** All DB queries use `?` placeholders — no SQL injection possible
- **`htmlspecialchars()`:** All user input is escaped before storage and display
- **AJAX Integration:** All data fetching uses the `Fetch API` (`async/await`) — page never reloads; errors handled gracefully with fallback sample data

### 3.4 State Management & Persistence
- **Sessions:** PHP `session_start()` used in `auth.php`, `contact.php`, `messages.php`; `$_SESSION['admin_logged_in']` guards all admin endpoints; `session_regenerate_id()` prevents session fixation attacks
- **Cookies:** Theme preference stored as a cookie (1 year expiry); "Remember Me" option sets a secure `admin_remember` cookie (7 days); cookies read on page load
- **Admin Dashboard:** Full CRUD interface for projects; messages inbox with mark-read/delete; statistics dashboard showing live DB counts; session/cookie info display panel
- **Brute-Force Protection:** Login limited to 5 attempts per 5-minute window (stored in `$_SESSION`)

---

## 4. Database Schema

### Tables
| Table | Purpose |
|-------|---------|
| `projects` | Stores portfolio projects with title, description, tech stack, URLs, category, featured flag |
| `messages` | Stores contact form submissions with read/unread status |
| `admin_users` | Admin accounts with bcrypt-hashed passwords |

### Sample Data
- 4 seed projects across `web` and `backend` categories
- 1 admin user (`admin` / `admin123`)

---

## 5. Security Measures

| Concern | Implementation |
|---------|---------------|
| SQL Injection | PDO prepared statements throughout |
| XSS | `htmlspecialchars()` on all output |
| Session Fixation | `session_regenerate_id(true)` on login |
| Brute Force | 5-attempt lockout, 5-minute cooldown |
| CSRF (basic) | Session check on all state-changing endpoints |
| Rate Limiting | Contact form: 60-second cooldown per session |

---

## 6. Setup Instructions

### Requirements
- PHP 8.0+ with PDO and PDO_MySQL extensions
- MySQL 5.7+ or MariaDB 10.3+
- A web server (Apache/Nginx) or XAMPP/WAMP locally

### Steps

1. **Clone or copy** the `portfolio/` folder to your web server's document root (e.g., `htdocs/portfolio`)

2. **Import the database:**
   ```sql
   mysql -u root -p < sql/portfolio.sql
   ```
   Or import via phpMyAdmin.

3. **Configure database credentials** in `php/config.php`:
   ```php
   define('DB_USER', 'your_mysql_username');
   define('DB_PASS', 'your_mysql_password');
   ```

4. **Visit** `http://localhost/portfolio/` in your browser.

5. **Admin panel:** Go to `http://localhost/portfolio/admin-login.html`  
   Credentials: `admin` / `admin123`

---

## 7. AI Tool Usage Declaration

AI tools (Claude, GitHub Copilot) were used as a development assistant for:
- Suggesting CSS architecture and design patterns
- Debugging JavaScript async/await logic
- Generating boilerplate PHP PDO connection code
- Code review and security suggestions

All code was reviewed, understood, and adapted by the student. The design decisions, project structure, and content are original.

---

## 8. Checklist

- [x] Semantic HTML5 with proper tags, tables, and forms
- [x] Responsive CSS with Flexbox and Grid
- [x] External stylesheets with consistent branding
- [x] Dark/Light mode toggle (DOM + Cookies)
- [x] JavaScript form validation (client-side)
- [x] AJAX data loading without page refresh
- [x] Contact form saves to MySQL via PHP
- [x] Projects fetched dynamically from database
- [x] PHP Sessions for admin authentication
- [x] Cookies for theme and remember-me
- [x] Admin CRUD dashboard for projects
- [x] Admin inbox for contact messages
- [x] SQL export file included
- [x] Secure login (prepared statements, session regeneration, brute-force protection)
