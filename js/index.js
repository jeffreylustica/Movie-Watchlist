import {handleAllFetch} from './utils.js'

const formSubmit = document.querySelector('#search-movie-form')

formSubmit.addEventListener('submit', (e) => {
    const formData = new FormData(e.target)
    const searchInput = formData.get('input').toLowerCase()
    e.preventDefault()

    if (searchInput) {  
        handleAllFetch(searchInput, 1)             
    }
})






