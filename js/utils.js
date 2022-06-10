import {movieListContainerEl, MovieWatchlist, page} from './variables.js'

function renderHtmlReturn(argsArr) {
    async function awaitReturn() {
        const arrHtml = argsArr.map(async (itemId) => {
            return await getMovieInfo(itemId)
        }) 
        return arrHtml
    }
             
    (async () => {
        const values = await Promise.all(await awaitReturn())
        movieListContainerEl.innerHTML = values.join('')            
        createListButton()
        page === "index" && changeButtonIcon(argsArr)
    })()
}

async function getMovieInfo(movieId) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=6c3bc615&i=${movieId}`)
    const data = await res.json()
    const {Poster, Title, imdbRating, Runtime, Genre, imdbID, Plot} = data
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
                <button class="add-watchlist button-watchlist" id="watchlist-btn" data-id="${imdbID}">
                    <img src="${page === "index" ? "icons/Orion_add-circle.png" : "icons/Orion_delete-circle.png"}"  class="toggle-icon" id="watchlist-btn-icon">
                    ${page === "index" ? "Watchlist" : "Remove"}
                </button>
            </div>

            <p class="movie-intro">
            ${Plot}<span class="read-more">Read more</span>
            </p>                
        </div>`
}

function createListButton() {
    const watchlistBtn = document.querySelectorAll('#watchlist-btn')

    watchlistBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = e.target.dataset.id

            if (page === "index") {
                if(!MovieWatchlist.includes(movieId)) {
                    MovieWatchlist.push(movieId)
                    localStorage.setItem("MovieWatchlist", JSON.stringify(MovieWatchlist))
                    e.target.querySelector('#watchlist-btn-icon').src = "icons/Orion_confirm.png"
                }
            } else {
                const tempMovieWatchlist = JSON.parse(localStorage.getItem("MovieWatchlist"))
                const newMovieWatchList = tempMovieWatchlist.filter((id) => id !== movieId)
                localStorage.setItem("MovieWatchlist", JSON.stringify(newMovieWatchList))
                renderWatchlist(newMovieWatchList)                
            }           
        })
    })
}

function changeButtonIcon(idArr) {
    MovieWatchlist.forEach(itemId => {
        if (idArr.includes(itemId)) {
            const watchlistBtn = document.querySelectorAll('#watchlist-btn')
            watchlistBtn.forEach(button => {
                if (button.dataset.id === itemId) {
                    button.querySelector('#watchlist-btn-icon').src = "icons/Orion_confirm.png"
                }
            })
        }
    })
}

function renderWatchlist(watchlist) {
    if (watchlist.length) {
        renderHtmlReturn(watchlist)
    } else {
        movieListContainerEl.innerHTML = `
            <div class="display-message">
                <p>Your watchlist is looking a little empty...</p>
                <a href="index.html"><img src="icons/Orion_add-circle.png" alt="" class="toggle-icon">Let’s add some movies!</a> 
            </div>`
    }
}


export {renderHtmlReturn, getMovieInfo, createListButton, changeButtonIcon, renderWatchlist}