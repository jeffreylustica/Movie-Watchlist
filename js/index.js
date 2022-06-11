import {movieListContainerEl} from './variables.js'
import {renderHtmlReturn} from './utils.js'

const formSubmit = document.querySelector('#search-movie-form')

formSubmit.addEventListener('submit', (e) => {
    const formData = new FormData(e.target)
    const searchInput = formData.get('input').toLowerCase()
    e.preventDefault()

    if (searchInput) {
        movieListContainerEl.innerHTML = `
            <div class="display-message">
                <p>Loading...</p>
            </div>`
    
        function awaitReturn() {
            return fetchSearchInput(searchInput)
        }

        (async () => {
            const movieIdArr = await awaitReturn()
            if (movieIdArr) {
                renderHtmlReturn(movieIdArr)
            }           
        })()
        
    }
})

async function fetchSearchInput(searchInput) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=6c3bc615&s=${searchInput}`)
    const data = await res.json()
    console.log(data)

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
    } 
}


