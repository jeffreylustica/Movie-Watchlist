import {movieListContainerEl} from './variables.js'
import {fetchSearchInput, renderHtmlReturn} from './utils.js'

function createPagination() {
    const paginationEl = document.querySelector('#pagination')
    paginationEl.style.display = "block"
    paginationEl.innerHTML = ''

    for (let i = 0; i < 5; i++) {
        paginationEl.innerHTML += `
        <button class="page-number">${i + 1}</button>
        `      
    }   

    const pageNumberButton = document.querySelectorAll('.page-number')
    pageNumberButton.forEach(button => {
        button.addEventListener('click' , (e) => {
            const pageNumber = e.target.textContent
            const searchInput = document.querySelector('#search-input')

            movieListContainerEl.innerHTML = `
            <div class="display-message">
                <p>Loading...</p>
            </div>`
    
            function awaitReturn() {
                return fetchSearchInput(searchInput.value, pageNumber)
            }

            (async () => {
                const movieIdArr = await awaitReturn()
                if (movieIdArr) {
                    renderHtmlReturn(movieIdArr)
                }           
            })()

        })
    })
}


export {createPagination}