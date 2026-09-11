const userSearch = document.getElementById("user-search");
const searchBtn = document.getElementById("search-btn");
const watchlistBtn = document.getElementById("watchlist-btn");
const homeBtn = document.getElementById("home-btn");
const moviesBtn = document.getElementById("movies-btn");
const seriesBtn = document.getElementById("series-btn");
const movieCategoryBtn = document.querySelectorAll(".movie-category-button");
const seriesCategoryBtn = document.querySelectorAll(".series-category-button");
const watchlistScreen = document.querySelector(".watchlist-screen");
const watchlistContainer = document.querySelector(".watchlist-layout");
const carouselBox = document.querySelector(".carousel-box");
const todaysPickScreen = document.querySelector(".todays-pick-screen");
const moviesScreen = document.querySelector(".movies-screen");
const moviesGrid = document.querySelector(".movies-grid");
const seriesScreen = document.querySelector(".series-screen");
const seriesGrid = document.querySelector(".series-grid") || seriesScreen;
const loadMoreBtn = document.querySelectorAll(".load-more-btn");

let carouselTimer = null;
let page = 1;
let currentCategory = "popular";

async function getData(type, page = 1, genre = "popular", searchTerm = "") {
    const apiKey = ""; // Your API Key Here
    let baseUrl = "";
    
    if (type === "today pick") {
        baseUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
    } else if (type === "movies") {
        baseUrl = genre === "popular"
            ? `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
            : `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&page=${page}`;
    } else if (type === "series") {
        baseUrl = genre === "popular"
            ? `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=${page}`
            : `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genre}&page=${page}`;
} else if (type === "search") {
        baseUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`;
    }

    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error(`Error: ${error.message}`);
    }
}

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlistContainer.innerHTML = ""; 

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = "<p id='watchlist-msg'>Your watchlist is empty.</p>";
        return;
    }

    watchlist.forEach((item) => {
        watchlistContainer.innerHTML += `
            <div class="movie-card" data-id="${item.id}" data-title="${encodeURIComponent(item.title)}" data-poster="${item.posterPath}" data-rating="${item.rating}">
                <div>
                    <img src="${item.posterPath}" alt="${item.title}">
                    <div class="movie-card-info">
                        <h3>${item.title}</h3>
                        <span>⭐ ${item.rating}</span>
                    </div>
                </div>
                <button type="button" class="add-to-watchlist-btn">
                    <i class="fa-solid fa-bookmark"></i>
                </button>
            </div>
        `;
    });
}

function toggleWatchlist(card) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const id = String(card.dataset.id);
    const index = watchlist.findIndex(item => String(item.id) === id);

    if (index === -1) {
        const title = decodeURIComponent(card.dataset.title);
        const posterPath = card.dataset.poster;
        const rating = card.dataset.rating;

        watchlist.push({ id, title, posterPath, rating });
    } else {
        watchlist.splice(index, 1);
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    const cards = document.querySelectorAll(`[data-id="${id}"]`);
    cards.forEach(c => {
        const icon = c.querySelector(".add-to-watchlist-btn i");
        if (icon) {
            if (index === -1) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
            } else {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
            }
        }
    });

    if (!watchlistScreen.classList.contains("hidden")) {
        renderWatchlist();
    }
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-watchlist-btn");
    if (btn) {
        const card = btn.closest(".movie-card");
        if (card) toggleWatchlist(card);
    }
});

function createCardHTML(item) {
    const title = item.title || item.name || item.original_title || item.original_name || "Unknown";
    const posterPath = item.poster_path 
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
        : 'https://placehold.co/500x750?text=No+Image';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const isSaved = watchlist.some(w => String(w.id) === String(item.id));
    const iconClass = isSaved ? "fa-solid" : "fa-regular";

    return `
        <div class="movie-card" data-id="${item.id}" data-title="${encodeURIComponent(title)}" data-poster="${posterPath}" data-rating="${rating}">
            <div>
                <img src="${posterPath}" alt="${title}">
                <div class="movie-card-info">
                    <h3>${title}</h3>
                    <span>⭐ ${rating}</span>
                </div>
            </div>
            <button type="button" class="add-to-watchlist-btn">
                <i class="${iconClass} fa-bookmark"></i>
            </button>
        </div>
    `;
}

async function displayTodayPick() {
    const data = await getData("today pick");
    if (!data || !data.results) return;

    const movies = data.results.slice(0, 5);
    carouselBox.innerHTML = ""; 

    movies.forEach((movie, index) => {
        const title = movie.title || movie.name || movie.original_title || movie.original_name;
        const isHidden = index === 0 ? "slider" : "slider hidden";

        carouselBox.innerHTML += `
            <div class="${isHidden}">
                <img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" alt="${title}">
                <div class="slide-content">
                    <h2>${title}</h2>
                </div>
            </div>
        `;
    });

    const slides = document.querySelectorAll(".slider");
    let currentIndex = 0;

    if (carouselTimer) clearInterval(carouselTimer);

    carouselTimer = setInterval(() => {
        slides[currentIndex].classList.add("hidden");
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.remove("hidden");
    }, 5000);
}

async function displayMedia(pageNumber = 1, genre = "popular", type = "movies") {
    const data = await getData(type, pageNumber, genre);
    if (!data || !data.results) return;

    const targetContainer = type === "series" ? seriesGrid : moviesGrid;

    data.results.forEach((item) => {
        targetContainer.innerHTML += createCardHTML(item);
    });
}

async function searchMovie(searchTerm) {
    moviesScreen.classList.remove("hidden");
    todaysPickScreen.classList.add("hidden");
    seriesScreen.classList.add("hidden");
    watchlistScreen.classList.add("hidden");

    moviesGrid.innerHTML = "";

    const data = await getData("search", 1, "popular", searchTerm);
    if (!data || !data.results) return;

    data.results.forEach((item) => {
        if (item.media_type === "person") return;
        if (!item.title && !item.name && !item.original_title && !item.original_name) return;

        moviesGrid.innerHTML += createCardHTML(item);
    });
}

homeBtn.addEventListener("click", () => {
    todaysPickScreen.classList.remove("hidden");
    moviesScreen.classList.add("hidden");
    seriesScreen.classList.add("hidden");
    watchlistScreen.classList.add("hidden");
    displayTodayPick(); 
});

moviesBtn.addEventListener("click", () => {
    moviesScreen.classList.remove("hidden");
    todaysPickScreen.classList.add("hidden");
    seriesScreen.classList.add("hidden");
    watchlistScreen.classList.add("hidden");
    if (carouselTimer) clearInterval(carouselTimer);
    page = 1;
    currentCategory = "popular";
});

seriesBtn.addEventListener("click", () => {
    seriesScreen.classList.remove("hidden");
    todaysPickScreen.classList.add("hidden");
    moviesScreen.classList.add("hidden");
    watchlistScreen.classList.add("hidden");
    if (carouselTimer) clearInterval(carouselTimer); 
    
    page = 1;
    currentCategory = "popular";

    if (seriesGrid.children.length === 0) {
        displayMedia(1, "popular", "series");
    }
});

watchlistBtn.addEventListener("click", () => {
    watchlistScreen.classList.remove("hidden");
    todaysPickScreen.classList.add("hidden");
    moviesScreen.classList.add("hidden");
    seriesScreen.classList.add("hidden");
    renderWatchlist();
});

movieCategoryBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        moviesGrid.innerHTML = "";
        movieCategoryBtn.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        
        page = 1;
        currentCategory = btn.dataset.genreId || "popular";
        
        displayMedia(page, currentCategory, "movies");
    });
});

seriesCategoryBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        seriesGrid.innerHTML = "";
        seriesCategoryBtn.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        
        page = 1;
        currentCategory = btn.dataset.genreId || "popular";
        
        displayMedia(page, currentCategory, "series");
    });
});

loadMoreBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        page++;
        const isSeriesActive = !seriesScreen.classList.contains("hidden");
        const activeType = isSeriesActive ? "series" : "movies";
        
        displayMedia(page, currentCategory, activeType);
    });
});

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && document.activeElement === userSearch) {
        searchBtn.click();
    }    
});

searchBtn.addEventListener("click", () => {
    const query = userSearch.value.trim();
    if (query === "") {
        moviesGrid.innerHTML = "";
        page = 1;
        displayMedia(page, currentCategory, "movies");
        return;
    }
    searchMovie(query);
});

displayTodayPick();
displayMedia(1, "popular", "movies");