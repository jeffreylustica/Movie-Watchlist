const movieListContainerEl = document.querySelector('#movie-list-container-el')
let MovieWatchlist = JSON.parse(localStorage.getItem("MovieWatchlist")) || []
const page = document.body.id

export {movieListContainerEl, MovieWatchlist, page}