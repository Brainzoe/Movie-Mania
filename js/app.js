const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjJkYzI3OTI4ZjE3YjRmYmQyMDEwNWIyZTZmMTZhNCIsIm5iZiI6MTcyODk5NjQyOS43ODM0ODgsInN1YiI6IjY3MGU2MTA0ZjU4YTkyMDZhYTQxZTY0ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kBa18bcLmr-F9l3WqXsRvdhww0cp8ESPl5QZeEjAW9w';

const baseUrl = 'https://api.themoviedb.org/3';
const trendingMoviesEndpoint = `${baseUrl}/trending/movie/week`;
const searchEndpoint = `${baseUrl}/search/movie?query=`;
const genreEndpoint = `${baseUrl}/genre/movie/list`;
const discoverEndpoint = `${baseUrl}/discover/movie`;

// Fetch trending movies on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
    fetchMovieCategories();
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

// Fetch movie categories (genres)
async function fetchMovieCategories() {
    try {
        const response = await fetch(genreEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        renderCategoryButtons(data.genres);
    } catch (error) {
        console.error('Error fetching movie categories:', error);
        showError('Failed to load movie categories.');
    }
}

// Render category buttons
function renderCategoryButtons(categories) {
    const categoriesContainer = document.getElementById('categories-container');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.onclick = () => fetchMoviesByCategory(category.id);
        categoriesContainer.appendChild(button);
    });
}

// Fetch movies by category (genre)
async function fetchMoviesByCategory(genreId) {
    showLoadingIndicator();
    try {
        const response = await fetch(`${discoverEndpoint}?with_genres=${genreId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        renderMovies(data.results, '#trending-list');  // Reuse same container for displaying category movies
    } catch (error) {
        console.error('Error fetching movies by category:', error);
        showError('Failed to load movies for this category.');
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
        <div class="movie" onclick="showMovieDetails(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="addToWatchlist('${movie.title}')">Add to Watchlist</button>
        </div>
    `).join('');
}

// Show movie details
async function showMovieDetails(movieId) {
    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjJkYzI3OTI4ZjE3YjRmYmQyMDEwNWIyZTZmMTZhNCIsIm5iZiI6MTcyODk5NjQyOS43ODM0ODgsInN1YiI6IjY3MGU2MTA0ZjU4YTkyMDZhYTQxZTY0ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kBa18bcLmr-F9l3WqXsRvdhww0cp8ESPl5QZeEjAW9w'; // Insert your actual access token
    const baseUrl = 'https://api.themoviedb.org/3';

    try {
        // Fetch movie details
        const movieDetailsResponse = await fetch(`${baseUrl}/movie/${movieId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!movieDetailsResponse.ok) {
            throw new Error('Error fetching movie details.');
        }

        const movieDetails = await movieDetailsResponse.json();

        // Populate the modal with movie details
        document.getElementById('movie-title').innerHTML = movieDetails.title || 'No Title Available';
        document.getElementById('movie-synopsis').innerHTML = movieDetails.overview || 'No Synopsis Available';
        
        // Clear and populate the cast list
        const movieCast = document.getElementById('movie-cast');
        movieCast.innerHTML = ''; // Clear existing cast
        movieDetails.cast.forEach(member => {
            const listItem = document.createElement('li');
            listItem.textContent = member.name; // Assuming member has a 'name' property
            movieCast.appendChild(listItem);
        });

        // Display the modal
        document.getElementById('movie-details-modal').style.display = 'block';

    } catch (error) {
        console.error(error.message);
        // Optionally display an error message to the user
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById('movie-details-modal').style.display = 'none';
}

// Render movie details in modal
function renderMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details'); // Replace with your actual container ID

    // Clear previous details
    detailsContainer.innerHTML = '';

    // Create elements to display movie details
    const title = document.createElement('h1');
    title.innerText = movie.title;

    const overview = document.createElement('p');
    overview.innerText = movie.overview;

    const rating = document.createElement('p');
    rating.innerText = `Rating: ${movie.vote_average}`;

    const releaseDate = document.createElement('p');
    releaseDate.innerText = `Release Date: ${movie.release_date}`;

    // Append elements to the details container
    detailsContainer.appendChild(title);
    detailsContainer.appendChild(overview);
    detailsContainer.appendChild(rating);
    detailsContainer.appendChild(releaseDate);

    // Display image gallery
    renderImageGallery(movie.backdrop_path, movie.poster_path);
}

function renderImageGallery(backdropPath, posterPath) {
    const galleryContainer = document.getElementById('image-gallery'); // Replace with your actual container ID
    galleryContainer.innerHTML = ''; // Clear previous images

    // Create image elements
    const backdropImg = document.createElement('img');
    backdropImg.src = `https://image.tmdb.org/t/p/w500${backdropPath}`;
    backdropImg.alt = 'Backdrop Image';

    const posterImg = document.createElement('img');
    posterImg.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
    posterImg.alt = 'Poster Image';

    // Append images to the gallery container
    galleryContainer.appendChild(backdropImg);
    galleryContainer.appendChild(posterImg);
}

function renderCredits(credits) {
    const creditsContainer = document.getElementById('movie-credits'); // Replace with your actual container ID

    // Clear previous credits
    creditsContainer.innerHTML = '';

    // Check if the cast exists and is an array
    if (credits.cast && Array.isArray(credits.cast)) {
        credits.cast.forEach(member => {
            const castMember = document.createElement('p');
            castMember.innerText = `${member.name} as ${member.character}`;
            creditsContainer.appendChild(castMember);
        });
    } else {
        console.error('Credits data is not available or is not an array.');
    }
}



// Close the modal
function closeModal() {
    document.getElementById('movie-details-modal').style.display = 'none';
}
// Add to watchlist
function addToWatchlist(movieTitle) {
    const watchlist = document.getElementById('watchlist-items');
    const listItem = document.createElement('li');
    listItem.textContent = movieTitle;
    listItem.id = movieTitle; // Set id for easy removal
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeFromWatchlist(movieTitle); // Bind the remove function
    listItem.appendChild(removeButton);
    watchlist.appendChild(listItem);
    
    // Save to localStorage
    let savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!savedWatchlist.includes(movieTitle)) { // Prevent duplicates
        savedWatchlist.push(movieTitle);
        localStorage.setItem('watchlist', JSON.stringify(savedWatchlist));
    }
}

// Remove from watchlist
function removeFromWatchlist(movieTitle) {
    const watchlist = document.getElementById('watchlist-items');
    const listItem = document.getElementById(movieTitle);
    if (listItem) {
        watchlist.removeChild(listItem);
    }
    
    // Update localStorage
    let savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    savedWatchlist = savedWatchlist.filter(movie => movie !== movieTitle); // Remove the movie
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
