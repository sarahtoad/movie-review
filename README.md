# 🎬 Movie Review Application — Frontend

A modern and responsive movie review platform built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

The application allows users to explore movies, watch trailers, read and write reviews, rate movies, manage favorites, and maintain a personal watchlist.

---

## ✨ Features

### 🎥 Movie Discovery

* Browse a catalog of movies
* Search for movies
* View movie genres, ratings, release dates, and runtime
* Access available streaming platform links

### 📖 Movie Details

* Detailed movie information
* Embedded YouTube trailers
* Average user rating
* Director information
* Runtime and release date
* Movie genres

### ⭐ Reviews & Ratings

* Authenticated users can rate movies
* Leave written reviews
* Star-based rating system
* Dynamic average rating calculation

### ❤️ Personal Lists

* Add movies to **Favorites**
* Remove movies from **Favorites**
* Add movies to **Watchlist**
* Remove movies from **Watchlist**

### 🎨 Modern UI

* Responsive design
* Clean and modern interface
* Built with Tailwind CSS
* Lucide icons
* Accessible and user-friendly experience

---

## 🛠️ Tech Stack

| Technology       | Usage                        |
| ---------------- | ---------------------------- |
| **Next.js 15**   | React framework & App Router |
| **TypeScript**   | Type-safe development        |
| **Tailwind CSS** | Styling & responsive design  |
| **Lucide React** | Icons                        |
| **Turbopack**    | Development bundler          |

---

## 📋 Prerequisites

Before running the project, make sure you have:

* **Node.js 18+**
* **npm**, **pnpm**, **yarn**, or **bun**
* A running instance of the backend API

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movie-review-frontend.git
cd movie-review-frontend
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or with another package manager:

```bash
pnpm install
# or
yarn install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

You can also copy the example environment file if available:

```bash
cp .env.example .env.local
```

> ⚠️ **Important:** Never commit `.env.local` or other files containing sensitive information to GitHub.

---

## 💻 Running the Project

### Development

Start the development server with Turbopack:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The application should now be running locally.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

---

## 📜 Available Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Starts the development server with Turbopack |
| `npm run build` | Builds the application for production        |
| `npm run start` | Starts the production server                 |
| `npm run lint`  | Checks the codebase for linting issues       |

---

## 📂 Project Structure

```text
movie-review-frontend/
│
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   │
│   └── movies/
│       └── [id]/
│           └── page.tsx        # Movie details & reviews
│
├── components/                 # Reusable UI components
│
├── public/                     # Static assets & images
│
├── .env.example                # Environment variables template
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

> The project structure may evolve as new features and components are added.

---

## 🔗 Backend

This frontend communicates with a separate backend API.

Set the backend URL in your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Make sure the backend server is running before using features that require API access, such as authentication, reviews, favorites, or watchlists.

---

## 🔐 Environment Variables

| Variable              | Description     | Example                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

---

## 🌱 Development

To contribute to the project:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Test your changes locally
5. Commit your changes

```bash
git add .
git commit -m "feat: add your feature"
```

6. Push your branch

```bash
git push origin feature/your-feature
```

7. Open a Pull Request

---

## 📄 License

This project is developed for educational and development purposes.

---

## 👩‍💻 Author

Developed with ❤️ using **Next.js**, **TypeScript**, and **Tailwind CSS**.
