const savedMovieList = JSON.parse(localStorage.getItem("MovieWatchlist"))
const movieListContainerEl = document.querySelector('#movie-list-container-el')


if (savedMovieList) {
    async function awaitReturn() {
        const movieArrHtml = savedMovieList.map(async (movieId) => {
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
    movieListContainerEl.innerHTML = `
        <div class="display-message">
            <p>Your watchlist is looking a little empty...</p>
            <a href="index.html" class="add-watchlist button-watchlist">
                <img src="icons/Orion_add-circle.png" alt="plus sign with black background" class="toggle-icon">
                Let’s add some movies!
            </a>
        </div>`
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

function createAddListButton() {
    const addWatchlistBtn = document.querySelectorAll('#add-watchlist-btn')

    addWatchlistBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = e.target.dataset.id
            if(!MovieWatchlist.includes(movieId)) {
                MovieWatchlist.push(movieId)
                localStorage.setItem("MovieWatchlist", JSON.stringify(MovieWatchlist))
                console.log(JSON.parse(localStorage.getItem("MovieWatchlist")))
                console.log(MovieWatchlist)
            }
            
        })
    })
}