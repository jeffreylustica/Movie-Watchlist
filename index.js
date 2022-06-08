const formSubmit = document.querySelector('#search-movie-form')
const movieListContainerEl = document.querySelector('#movie-list-container-el')

let movieIdArr = []
let movieListArr = []

formSubmit.addEventListener('submit', (event) => {
    const formData = new FormData(event.target)
    const searchInput = formData.get('input').toLowerCase()
    event.preventDefault()

    if (searchInput) {
        movieListContainerEl.innerHTML = ""
        fetchSearchInput(searchInput)
    } else {
        movieListContainerEl.innerHTML = `
        <div class="display-message">
            <p>Unable to find what you’re looking for. Please try another search.</p>
        </div>`
    }
})

async function fetchSearchInput(searchInput) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=6c3bc615&s=${searchInput}`)
    const data = await res.json()

    if (data) {
        const dataArr = data.Search
        movieIdArr = dataArr.map(data => {
            return data.imdbID
        })

        async function awaitReturn() {
            const movieArrHtml = movieIdArr.map(async (movieId) => {
                return await getMovieInfo(movieId)
            }) 
            return movieArrHtml
        }
                 
        (async () => {
            const values = await Promise.all(await awaitReturn())
            movieListContainerEl.innerHTML = values.join('')
            
            createAddListButton()
        })()
    } else {
        displayMessage(errorMessage)
    } 
}

async function getMovieInfo(movieId) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=6c3bc615&i=${movieId}`)
    const data = await res.json()
    const {Poster, Title, imdbRating, Runtime, Genre, Plot} = data
    return `
        <div class="movie">
            <img src="${Poster}" alt="man with a gun, woman holding cigarrete and top view of buildings" class="movie-cover-image">

            <div class="movie-info-primary">
                <p class="movie-name">${Title}</p>
                <img src="icons/Orion_star.png" alt="" class="star-icon">
                <span class="movie-rating">${imdbRating}</span>
            </div>

            <div class="movie-info-secondary">
                <span class="movie-minutes">${Runtime}</span>
                <span class="movie-genre">${Genre}</span>
                <button class="add-watchlist button-watchlist" id="add-watchlist-btn" data-id="${movieId}">
                    <img src="icons/Orion_add-circle.png" alt="plus sign with black background" class="toggle-icon">
                    Watchlist
                </button>
            </div>

            <p class="movie-intro">
            ${Plot}<span class="read-more">Read more</span>
            </p>                
        </div>
    `
}

let MovieWatchlist = JSON.parse(localStorage.getItem("MovieWatchlist")) || []

function createAddListButton() {
    const addWatchlistBtn = document.querySelectorAll('#add-watchlist-btn')

    addWatchlistBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = e.target.dataset.id
            if(!MovieWatchlist.includes(movieId)) {
                MovieWatchlist.push(movieId)
                localStorage.setItem("MovieWatchlist", JSON.stringify(MovieWatchlist))
            }           
        })
    })
}

