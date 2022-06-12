import {movieListContainerEl} from './variables.js'
import {fetchSearchInput, renderHtmlReturn} from './utils.js'

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
            return fetchSearchInput(searchInput, 1)
        }

        (async () => {
            const movieIdArr = await awaitReturn()
            if (movieIdArr) {
                renderHtmlReturn(movieIdArr)
            }           
        })()
        
    }
})






