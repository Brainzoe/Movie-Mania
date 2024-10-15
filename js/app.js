const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjJkYzI3OTI4ZjE3YjRmYmQyMDEwNWIyZTZmMTZhNCIsIm5iZiI6MTcyODk5NjQyOS43ODM0ODgsInN1YiI6IjY3MGU2MTA0ZjU4YTkyMDZhYTQxZTY0ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kBa18bcLmr-F9l3WqXsRvdhww0cp8ESPl5QZeEjAW9w'; 
const baseUrl = 'https://api.themoviedb.org/3';
const trendingMoviesEndpoint = `${baseUrl}/trending/movie/week`;
const searchEndpoint = `${baseUrl}/search/movie?query=`;

// Fetch trending movies on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
    setupSearch();
});

// Fetch trending movies
async function fetchTrendingMovies() {
    showLoadingIndicator();
    try {
        const response = await fetch(trendingMoviesEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        renderMovies(data.results, '#trending-list');
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        showError('Failed to load trending movies.');
    } finally {
        hideLoadingIndicator();
    }
}

// Setup search functionality
function setupSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length > 2) {
            try {
                const response = await fetch(searchEndpoint + query, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                renderMovies(data.results, '#trending-list');
            } catch (error) {
                console.error('Error searching for movies:', error);
                showError('Failed to search for movies.');
            }
        }
    });
}

// Render movie data
function renderMovies(movies, containerSelector) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = movies.map(movie => `
        <div class="movie">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="addToWatchlist('${movie.title}')">Add to Watchlist</button>
        </div>
    `).join('');
}

// Add to watchlist
function addToWatchlist(movieTitle) {
    const watchlist = document.getElementById('watchlist-items');
    const listItem = document.createElement('li');
    listItem.textContent = movieTitle;
    watchlist.appendChild(listItem);
    
    // Save to localStorage
    let savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    savedWatchlist.push(movieTitle);
    localStorage.setItem('watchlist', JSON.stringify(savedWatchlist));
}

// Load watchlist on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    savedWatchlist.forEach(movie => addToWatchlist(movie));
});

// Error handling
function showError(message) {
    const errorElement = document.createElement('p');
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}

// Loading indicator
function showLoadingIndicator() {
    document.body.classList.add('loading');
}

function hideLoadingIndicator() {
    document.body.classList.remove('loading');
}
