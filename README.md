# 🎬 Movio - Movie & Series Discovery App

A modern, fully responsive web application for discovering movies and TV series, exploring trending titles, and managing a personal Watchlist. 

Built entirely with **Vanilla JavaScript** using **The Movie Database (TMDB) API**.

---

## 🚀 Features

* **Trending Carousel:** Automatic header slider on the home page showcasing top trending titles ("Today's Pick").
* **Movie & Series Exploration:** Dedicated screens for movies and TV shows with real-time genre filtering.
* **Live Search:** Fast multi-search functionality supporting safe query handling (`encodeURIComponent`).
* **Interactive Watchlist:** Instant bookmarking system to save or remove items with real-time UI synchronization across all screens.
* **Data Persistence:** Persistent Watchlist storage using `LocalStorage` so saved items remain intact after refreshing the browser.
* **More Info Overlay:** Detailed pop-up cards providing overviews, release dates, and user ratings for every item.
* **Smart Pagination:** "Load More" capability for seamless infinite scrolling within active media types and categories.
* **Fully Responsive UI:** Flexible layout adapted for mobile, tablet, and desktop screens using CSS Grid & Flexbox.

---

## 🛠️ Tech Stack

* **HTML5:** Semantic HTML structure.
* **CSS3:** 
  * Custom Properties (Variables) & Glassmorphism UI styling.
  * Responsive Layouts (Flexbox, CSS Grid using `auto-fill` & `minmax`).
  * Media Queries for mobile-first adaptations.
* **JavaScript (ES6+):**
  * **Asynchronous JS:** `async/await` and `Fetch API` for RESTful API integration.
  * **DOM Manipulation:** Dynamic element rendering & Event Delegation pattern.
  * **State & LocalStorage:** Client-side data management and persistence.
* **FontAwesome:** Icon library for interactive buttons.

---

## 📦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avtzo/Movio.git
2. **Make Sure to get your own API Key from [Themoviedb](https://themoviedb.org)
3. **Add your API Key in the <sub>script.js</sub> file.
