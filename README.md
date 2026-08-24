<div align="center">

# 🎮 Quizzio

### *A retro-styled, full-stack quiz web application built with Flask*

[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-black?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![SQLite](https://img.shields.io/badge/SQLite-Database-green?style=flat-square&logo=sqlite)](https://sqlite.org)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5--Flash-orange?style=flat-square&logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Application Flow](#-application-flow)
- [Database Schema](#️-database-schema)
- [Route Map](#-route-map)
- [Folder Structure](#-folder-structure)
- [Screenshots](#-screenshots)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [How to Use](#-how-to-use)
- [API Endpoints](#-api-endpoints)

---

## 🎯 About

**Quizzio** is a pixel-art themed, full-stack quiz platform where users can:
- Play **pre-built subject quizzes** (Math, Science, English, GK)
- **Create their own custom quizzes** using AI-generated questions powered by Google Gemini
- **Share** custom quizzes with friends via a unique 5-digit code
- **Track scores** and view results with a heart-based scoring system

The app has a distinctive retro pixel-art aesthetic with custom backgrounds, avatars, sound effects, and animations throughout the experience.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Secure signup & login with bcrypt password hashing |
| 🎭 **Avatar & Username Selection** | Choose from 12 pixel-art avatars before each session |
| 📚 **Subject Quizzes** | Built-in quizzes for Math, Science, English & General Knowledge |
| 🤖 **AI Question Generation** | Generate quiz questions on any topic using Google Gemini 2.5 Flash |
| 📁 **Custom Quiz Folders** | Organise custom quizzes into named folders |
| 🔑 **Quiz Code Sharing** | Share quizzes via auto-generated unique 5-digit codes |
| 🕹️ **Quiz Play Mode** | Play shared quizzes question-by-question with live tracking |
| 💖 **Heart Score System** | Visual score display using filled/empty hearts |
| 🎵 **Sound Effects** | Click sounds and background audio for immersion |
| 💾 **Session Persistence** | Stay logged in for up to 5 days with Flask sessions |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.10+, Flask 3.x |
| **Database** | SQLite via SQLAlchemy ORM |
| **Authentication** | Flask-Login, Flask-Bcrypt |
| **AI Integration** | Google Gemini 2.5 Flash (`google-genai`) |
| **Frontend** | HTML5, Vanilla CSS, JavaScript (ES6+) |
| **Templating** | Jinja2 |
| **Environment** | python-dotenv |
| **Font** | Press Start 2P (Google Fonts) |

---

## 🔄 Application Flow

### Overall User Journey

```mermaid
flowchart TD
    A([🌐 Visit Site]) --> B[index.html\nLanding Page]
    B --> C{Has Account?}
    C -- No --> D[signup.html\nCreate Account]
    C -- Yes --> E[login.html\nLogin]
    D --> E
    E --> F[select.html\nMain Menu]

    F --> G[🎮 Play Quiz]
    F --> H[✏️ Create Quiz]
    F --> I[🔑 Enter Code]

    G --> J[selectquiz.html\nChoose Subject]
    J --> K{Select Subject}
    K --> L[math.html]
    K --> M[science.html]
    K --> N[english.html]
    K --> O[gk.html]
    L & M & N & O --> P[score.html\nResults Page]

    H --> Q[code.html\nEnter Admin Code]
    Q --> R{Code Valid?}
    R -- Yes --> S[switch.html\nPick Avatar & Name]
    S --> T[create.html\nManage Folders]
    T --> U[custom.html\nBuild Quiz with AI]

    I --> Q
    R -- Quiz Code --> S
    S --> V[quizplay.html\nPlay Shared Quiz]
    V --> W[end-quiz\nSave Score]

    P --> F
    W --> F
```

---

### Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Flask
    participant DB as SQLite DB

    User->>Browser: Fill signup form
    Browser->>Flask: POST /signup
    Flask->>DB: Check if email exists
    DB-->>Flask: Not found
    Flask->>Flask: bcrypt.hash(password)
    Flask->>DB: INSERT new User
    Flask-->>Browser: Redirect → /login

    User->>Browser: Fill login form
    Browser->>Flask: POST /login
    Flask->>DB: Query User by email
    DB-->>Flask: User record
    Flask->>Flask: bcrypt.check_hash()
    Flask->>Flask: login_user() + session.permanent=True
    Flask-->>Browser: Redirect → /select
```

---

### Custom Quiz Creation Flow

```mermaid
flowchart LR
    A[Teacher/Creator\nenters code 00000] --> B[switch.html\nPick avatar + name]
    B --> C[create.html\nView folders]
    C --> D[Create new folder\nPOST /create_folder]
    D --> E[custom.html\nFolder workspace]
    E --> F{Add questions}
    F -- Manual --> G[Fill in question\noptions & answer]
    F -- AI-Powered --> H[POST /generate_questions\nwith topic]
    H --> I[Gemini 2.5 Flash\ngenerates 10 MCQs]
    I --> G
    G --> J[Save quiz\nPOST /custom/folder_name]
    J --> K[Unique 5-digit\ncode generated]
    K --> L[Share code\nwith students]
```

---

### Quiz Play Flow (Shared Quiz via Code)

```mermaid
sequenceDiagram
    actor Student
    participant Browser
    participant Flask
    participant DB as SQLite DB
    participant Gemini

    Student->>Browser: Enter 5-digit quiz code
    Browser->>Flask: POST /code
    Flask->>DB: Quiz.query.filter_by(code=...)
    DB-->>Flask: Quiz found ✓
    Flask-->>Browser: Redirect → /switch

    Student->>Browser: Pick avatar & username
    Browser->>Flask: POST /switch
    Flask->>DB: UPDATE user.username, user.avatar
    Flask-->>Browser: Redirect → /quizplay/<code>

    loop For each question
        Browser->>Student: Show question + options
        Student->>Browser: Select answer
        Browser->>Browser: Track score locally in JS
    end

    Browser->>Flask: POST /end-quiz {score}
    Flask->>DB: UPDATE user.score
    Flask-->>Browser: {success: true}
    Browser->>Flask: GET /score
    Flask-->>Browser: score.html with hearts display
```

---

### AI Question Generation Flow

```mermaid
flowchart TD
    A[Creator types a topic\ne.g. Solar System] --> B[POST /generate_questions\nJSON body: topic]
    B --> C[Flask receives request]
    C --> D[Build prompt string\nAsk for 10 MCQs in JSON]
    D --> E[client.models.generate_content\ngemini-2.5-flash]
    E --> F[Gemini returns raw text]
    F --> G[Strip markdown fences\n remove json and backticks]
    G --> H{json.loads valid?}
    H -- Yes --> I[Return questions array\nto frontend JS]
    H -- No --> J[Return error JSON\nto frontend]
    I --> K[JS renders questions\nin custom quiz editor]
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USER {
        int id PK
        string email
        string password
        string username
        string avatar
        int score
    }

    FOLDER {
        int id PK
        string name
        int user_id FK
    }

    QUIZ {
        int id PK
        string folder_name
        string code
        blob questions
        string owner
    }

    QUIZRESULT {
        int id PK
        int quiz_id
        int user_id
        int correct_answers
        int total_questions
    }

    USER ||--o{ FOLDER : "owns"
    USER ||--o{ QUIZRESULT : "has"
    QUIZ ||--o{ QUIZRESULT : "generates"
```

---

## 🗺️ Route Map

```mermaid
graph LR
    subgraph Public Routes
        R1[GET /]
        R2[GET POST /signup]
        R3[GET POST /login]
    end

    subgraph Protected Routes - Play
        R4[GET /select]
        R5[GET /selectquiz]
        R6[GET /math]
        R7[GET /science]
        R8[GET /english]
        R9[GET /gk]
        R10[GET /score]
        R11[POST /submit_quiz]
    end

    subgraph Protected Routes - Custom Quiz
        R12[GET POST /code]
        R13[GET POST /switch]
        R14[GET /create]
        R15[POST /create_folder]
        R16[GET POST /custom/folder_name]
        R17[GET /quizplay/quiz_code]
        R18[POST /end-quiz]
    end

    subgraph AI Route
        R19[POST /generate_questions]
    end

    subgraph Auth
        R20[GET /logout]
    end
```

---

## 📁 Folder Structure

```
Quizzio-Flask/
│
├── app.py                        # Main Flask application — all routes, models, logic
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables (not committed)
├── .gitignore
│
├── instance/
│   └── users.db                  # SQLite database (auto-created)
│
├── templates/                    # Jinja2 HTML templates
│   ├── index.html                # Landing page
│   ├── signup.html               # User registration
│   ├── login.html                # User login
│   ├── select.html               # Main menu (Play / Create)
│   ├── selectquiz.html           # Choose subject quiz
│   ├── math.html                 # Math quiz
│   ├── science.html              # Science quiz
│   ├── english.html              # English quiz
│   ├── gk.html                   # General Knowledge quiz
│   ├── score.html                # Results page with hearts
│   ├── code.html                 # Enter quiz/admin code
│   ├── switch.html               # Avatar & username picker
│   ├── create.html               # Folder manager for custom quizzes
│   ├── custom.html               # Custom quiz builder
│   └── quizplay.html             # Play a shared quiz
│
└── static/
    ├── css/                      # Stylesheets per page
    │   ├── login.css
    │   ├── create.css
    │   ├── score.css
    │   └── ...
    ├── js/                       # Page-specific JavaScript
    │   ├── create.js             # Folder creation via fetch API
    │   ├── custom.js             # Quiz builder + AI generation
    │   ├── math.js / science.js  # Built-in quiz logic
    │   ├── switch.js             # Avatar selection UI
    │   ├── score.js              # Score animation
    │   └── ...
    ├── images/                   # Backgrounds, avatars, UI elements
    │   ├── avatar1.png → avatar12.png
    │   ├── login.png
    │   ├── logo.png
    │   ├── colored_heart.png
    │   ├── empty_heart.png
    │   └── ...
    └── audio/                    # Sound effects
        └── click2.wav
```

---

## 📸 Screenshots

> 🖼️ *Replace each placeholder below with an actual screenshot after deployment.*

### Landing Page
![Landing Page](screenshots/index.png)
> *The animated retro-style landing page introducing Quizzio.*

---

### Signup & Login
![Signup Page](screenshots/signup.png)
> *User registration form with pixel-art background.*

![Login Page](screenshots/login.png)
> *Login page with flash message feedback.*

---

### Main Menu
![Select Page](screenshots/select.png)
> *The main menu where users choose between playing or creating a quiz.*

---

### Avatar & Username Selection
![Switch Page](screenshots/switch.png)
> *Avatar picker — choose from 12 pixel-art characters before starting.*

---

### Subject Quiz
![Quiz Page](screenshots/quiz.png)
> *A built-in subject quiz in action — one question at a time.*

---

### Score Page
![Score Page](screenshots/score.png)
> *Results screen showing filled/empty hearts representing correct answers.*

---

### Custom Quiz Creator
![Create Page](screenshots/create.png)
> *Folder manager for organising custom quizzes.*

![Custom Quiz Builder](screenshots/custom.png)
> *The AI-powered quiz builder — enter a topic, Gemini generates 10 MCQs instantly.*

---

### Shared Quiz Play
![Quiz Play](screenshots/quizplay.png)
> *Playing a shared quiz after entering a 5-digit code.*

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.10 or higher
- `pip`
- A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Poorvikab/Quizzio-Flask.git
cd Quizzio-Flask

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
pip install google-genai          # New Gemini SDK

# 4. Create your .env file (see section below)

# 5. Run the app
python app.py
```

The app will be available at **http://127.0.0.1:5000**

> The SQLite database (`users.db`) is created automatically on first run via `db.create_all()`.

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for AI question generation | ✅ Yes |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📘 How to Use

### As a Student / Player

1. **Sign up** and **log in**
2. Go to **Select** → choose **Play Quiz**
3. Pick a subject (Math, Science, English, GK)
4. Select your **avatar and username**
5. Answer all questions and view your **score with hearts**

**OR — play a shared quiz:**

1. Go to **Select** → **Enter Code**
2. Type the **5-digit code** shared by your teacher/friend
3. Pick your avatar and play!

---

### As a Teacher / Creator

1. Log in and go to **Select** → **Create Quiz**
2. Enter the **admin code: `00000`**
3. Pick an avatar and go to your **folder manager**
4. **Create a new folder** (quiz set)
5. Inside the folder:
   - **Manually add** questions, options, and correct answers
   - Or type a **topic** and let **Gemini AI generate 10 questions** instantly
6. **Save** the quiz — a unique **5-digit code** is generated
7. **Share the code** with students!

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | Landing page |
| `GET POST` | `/signup` | ❌ | User registration |
| `GET POST` | `/login` | ❌ | User login |
| `GET` | `/logout` | ✅ | Logout user |
| `GET` | `/select` | ✅ | Main menu |
| `GET` | `/selectquiz` | ✅ | Subject selection |
| `GET` | `/math` | ✅ | Math quiz page |
| `GET` | `/science` | ✅ | Science quiz page |
| `GET` | `/english` | ✅ | English quiz page |
| `GET` | `/gk` | ✅ | General Knowledge quiz page |
| `GET` | `/score` | ✅ | Score results page |
| `POST` | `/submit_quiz` | ✅ | Save score from built-in quiz |
| `GET POST` | `/code` | ✅ | Enter quiz/admin code |
| `GET POST` | `/switch` | ✅ | Avatar & username selection |
| `GET` | `/create` | ✅ | Folder manager |
| `POST` | `/create_folder` | ✅ | Create a new quiz folder |
| `GET POST` | `/custom/<folder_name>` | ✅ | Quiz builder for a folder |
| `POST` | `/generate_questions` | ❌ | AI question generation via Gemini |
| `GET` | `/quizplay/<quiz_code>` | ✅ | Play a shared quiz |
| `POST` | `/end-quiz` | ✅ | Save score from shared quiz |

---

## 👩‍💻 Author

**Poorvika B**
- GitHub: [@Poorvikab](https://github.com/Poorvikab)
- Project: [Quizzio-Flask](https://github.com/Poorvikab/Quizzio-Flask)

---

<div align="center">
  Made with ❤️ and lots of pixel art
</div>
