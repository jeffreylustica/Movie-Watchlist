import {movieListContainerEl, MovieWatchlist, page} from './variables.js'
import {createPagination} from './pagination.js'

async function fetchSearchInput(searchInput, pageNumber) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=6c3bc615&s=${searchInput}&page=${pageNumber}`)
    const data = await res.json()

    if (data.Response === "True") {
        const dataArr = data.Search
        const movieIds = dataArr.map(data => {
            return data.imdbID
        })
        return movieIds     
    } else {
        movieListContainerEl.innerHTML = `
        <div class="display-message">
            <p>Unable to find what you’re looking for. Please try another search.</p>
        </div>`
        const paginationEl = document.querySelector('#pagination')
        paginationEl.style.display = "none"
    } 
}

function fetchMovieInfo(argsArr) {
    async function awaitReturn() {
        const arrHtml = argsArr.map(async (itemId) => {
            return await getMovieInfo(itemId)
        }) 
        return arrHtml
    }
             
    return (async () => {
        const values = await Promise.all(await awaitReturn())
        return values
    })()
}

function renderMovieHtml(arrHtml) {
    movieListContainerEl.innerHTML = arrHtml.join('')
}

function handleAllFetch(searchItem, pageNumber) {
    movieListContainerEl.innerHTML = `
            <div class="display-message">
                <p>Loading...</p>
            </div>`

    function awaitReturn() {
        return fetchSearchInput(searchItem, pageNumber)
    }

    (async () => {
        const movieIdArr = await awaitReturn()
        if (movieIdArr) {
            const movieInfoHtml = await fetchMovieInfo(movieIdArr)
            renderMovieHtml(movieInfoHtml)
            createListButton()
            page === "index" && changeButtonIcon(movieIdArr)
            createPagination()  
        }          
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
            ${Plot}
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
        (async () => {
            const movieInfoHtml = await fetchMovieInfo(watchlist)
            renderMovieHtml(movieInfoHtml)
            createListButton()       
        })()
    } else {
        movieListContainerEl.innerHTML = `
            <div class="display-message">
                <p>Your watchlist is looking a little empty...</p>
                <a href="index.html"><img src="icons/Orion_add-circle.png" alt="" class="toggle-icon">Let’s add some movies!</a> 
            </div>`
    }
}


export {fetchSearchInput, fetchMovieInfo, getMovieInfo, createListButton, changeButtonIcon, renderWatchlist, renderMovieHtml, handleAllFetch}