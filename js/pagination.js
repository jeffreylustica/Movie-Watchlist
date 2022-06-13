import {movieListContainerEl} from './variables.js'
import {fetchSearchInput, renderHtmlReturn} from './utils.js'

let highestPageNumber = 5
let lowestPageNumber = 1

function createPagination() {
    
    renderPagination(highestPageNumber)

    const pageNumberButton = document.querySelectorAll('.page-number')
    pageNumberButton.forEach(button => {
        button.addEventListener('click' , (e) => {
            const pageNumber = e.target.dataset.index
            if (pageNumber > highestPageNumber) {                
                highestPageNumber += 5
                lowestPageNumber +=5
                renderPagination(highestPageNumber)
            } else if (pageNumber < lowestPageNumber) {
                highestPageNumber -= 5
                lowestPageNumber -=5
                renderPagination(highestPageNumber)
            }
            
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

function renderPagination(highestPageNumberParam) {
    console.log(highestPageNumberParam)
    const paginationEl = document.querySelector('#pagination')
    paginationEl.style.display = "block"
    paginationEl.innerHTML = ''
    let pageNumberButtonsHtml = ""
    let paginationHtml = ""

    for (let i = highestPageNumberParam - 5; i < highestPageNumberParam; i++) {
        pageNumberButtonsHtml += `
        <button class="page-number" data-index= ${i + 1} >${i + 1}</button>
        `      
    } 
    paginationHtml = `
        ${highestPageNumberParam !== 5 ? `<button class="page-number" data-index=${highestPageNumberParam - 5}>&laquo;</button>` : ""}  
        ${pageNumberButtonsHtml}
        <button class="page-number" data-index=${highestPageNumberParam + 1}>&raquo;</button>
    `
    paginationEl.innerHTML = paginationHtml
}


export {createPagination}