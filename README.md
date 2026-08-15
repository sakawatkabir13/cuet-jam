<div align="center">

# 🎓 CUET Jam

**A community platform for CUET students, faculty, and alumni — share resources, find collaborators, and stay connected.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-red.svg)](https://jwt.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📖 About

**CUET Jam** is a full-stack web platform built for the Chittagong University of Engineering & Technology (CUET) community. It brings students, faculty, and alumni together in one place to:

- 📚 **Share academic resources** — notes, books, slides, and links, organized by department and category.
- 🤝 **Find collaborators** — post project ideas, form teams, and track collaboration status.
- 📰 **Stay updated** — share posts and announcements across the community.
- 🔍 **Lost & Found** — report and find lost items on campus.
- 🔐 **Role-based access** — distinct registration flows and dashboards for **Students**, **Faculty**, and **Alumni**.

The backend is a secure Spring Boot REST API with JWT authentication; the frontend is server-rendered HTML/CSS/JS served as static assets.

---

## ✨ Features

- 👤 **Multi-role authentication** — separate registration and login flows for Students, Faculty, and Alumni
- 🔑 **JWT-based secure auth** — stateless tokens with Spring Security
- 📧 **Email notifications** — SMTP-based welcome and verification emails (Gmail app password)
- 📚 **Resource library** — browse, upload, and categorize academic resources by department
- 🤝 **Collaboration board** — create sections, manage status, and discover teammates
- 📰 **Community posts** — share updates with the CUET community
- 🔍 **Lost & Found** — report and search lost items on campus
- 🛡️ **Admin controls** — moderation endpoints for managing users and content
- 🌱 **Seed data** — `DataLoader` bootstraps departments and demo accounts on first run

---

## 🛠️ Tech Stack

**Backend**
- ☕ Java 17
- 🍃 Spring Boot 3.2.0 (Web, Data JPA, Security, Mail, Validation)
- 🐘 MySQL 8 (with Hibernate)
- 🔐 JWT (`jjwt` 0.11.5)
- 📦 Maven

**Frontend**
- 🌐 HTML5, CSS3, vanilla JavaScript
- 🎨 Custom responsive styling (no heavy framework)
- 📡 Fetch-based REST API client

**Tooling**
- 🔁 Spring DevTools (hot reload)
- 🧪 JUnit 5 + Spring Test

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Java JDK 17+](https://adoptium.net/)
- [Maven 3.8+](https://maven.apache.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)
- A Gmail account with an **App Password** (for email features)

### 🔒 Step 1 — Configure Secrets

This project keeps real credentials out of Git. The first time you clone:

```bash
cp src/main/resources/application-template.properties \
   src/main/resources/application.properties
```

Then edit `application.properties` and fill in:

| Placeholder | What to put |
|---|---|
| `YOUR_MYSQL_PASSWORD_HERE` | Your local MySQL root password |
| `YOUR_GMAIL_EMAIL_HERE` | Your Gmail address |
| `YOUR_GMAIL_APP_PASSWORD_HERE` | A 16-char [Gmail App Password](https://myaccount.google.com/apppasswords) |
| `GENERATE_A_LONG_RANDOM_SECRET_KEY_HERE...` | A long random JWT secret (e.g. `openssl rand -base64 64`) |

> See [`SECURITY-README.md`](SECURITY-README.md) for the full security walkthrough.

### 🗄️ Step 2 — Create the Database

```sql
CREATE DATABASE cuet_jam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Schema is bootstrapped automatically via `schema.sql` on first run.

### ▶️ Step 3 — Run the App

```bash
# Clone the repository
git clone https://github.com/sakawatkabir13/cuet-jam.git
cd cuet-jam

# Build and run
./mvnw spring-boot:run
```

Or with a system-wide Maven:

```bash
mvn clean spring-boot:run
```

The app will start on **http://localhost:8080**.

### 🌐 Step 4 — Open the App

| Page | URL |
|---|---|
| 🏠 Home | http://localhost:8080/home.html |
| 🔑 Login | http://localhost:8080/login.html |
| 📝 Register (Student) | http://localhost:8080/register-student.html |
| 📝 Register (Faculty) | http://localhost:8080/register-faculty.html |
| 📝 Register (Alumni) | http://localhost:8080/register-alumni.html |

---

## 📂 Project Structure

```
cuet-jam/
├── pom.xml
├── README.md
├── SECURITY-README.md
└── src/
    ├── main/
    │   ├── java/com/cuetjam/
    │   │   ├── CuetJamApplication.java     # Entry point
    │   │   ├── config/                      # Security, JWT, data loader
    │   │   ├── controller/                  # REST endpoints
    │   │   ├── dto/                         # Request payloads
    │   │   ├── model/                       # JPA entities
    │   │   ├── repository/                  # Spring Data repos
    │   │   └── service/                     # Business logic
    │   └── resources/
    │       ├── application-template.properties
    │       ├── schema.sql
    │       └── static/                      # HTML, CSS, JS, images
    └── test/
```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register/student` | Register a new student | Public |
| `POST` | `/api/auth/register/faculty` | Register a new faculty | Public |
| `POST` | `/api/auth/register/alumni` | Register a new alumnus | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/posts` | List community posts | Public |
| `POST` | `/api/posts` | Create a post | 🔒 User |
| `GET` | `/api/resources` | List resources | Public |
| `POST` | `/api/resources` | Upload a resource | 🔒 User |
| `GET` | `/api/collabs` | List collaborations | Public |
| `POST` | `/api/collabs` | Create a collaboration | 🔒 User |
| `GET` | `/api/lostfound` | List lost & found items | Public |
| `GET` | `/api/users/me` | Current user profile | 🔒 User |
| `*` | `/api/admin/**` | Admin-only operations | 🔒 Admin |

> 🔒 = requires `Authorization: Bearer <jwt>` header

---

## 🖼️ Screenshots

> Add screenshots here to make the README pop on GitHub.
> Drop them in `docs/screenshots/` and reference like:

```markdown
![Home page](docs/screenshots/home.png)
```

| Home | Login | Resources |
|---|---|---|
| _coming soon_ | _coming soon_ | _coming soon_ |

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**.

1. 🍴 Fork the project
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔁 Open a Pull Request

Please make sure to update tests as appropriate and never commit `application.properties` with real secrets.

---

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](../../issues) with a clear description and reproduction steps.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for the full text.

```
MIT License

Copyright (c) 2026 Sakawat Kabir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**Sakawat Kabir**
- GitHub: [@sakawatkabir13](https://github.com/sakawatkabir13)

---

## 🙏 Acknowledgments

- The CUET community — the inspiration for this project
- [Spring Boot](https://spring.io/projects/spring-boot) and the wider Spring ecosystem
- [shields.io](https://shields.io/) for the README badges
- Every contributor who helps improve CUET Jam

---

<div align="center">

⭐ **If you find this project useful, please give it a star!** ⭐

Made with ❤️ for the CUET community

</div>
