const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

//api movie load
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=3a8de144`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
}

//  loadMovies('Spyder');

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    }
    else {
        searchList.classList.add('hide-search-list'); 
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = " ";
    for (let i = 0; i < movies.length; i++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[i].imdbID;
        movieListItem.classList.add("search-list-item");
        if(movies[i].Poster != "N/A")
            moviePoster = movies[i].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[i].Title}</h3>
            <p>${movies[i].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () =>{
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://omdbapi.com/?i=${movie.dataset.id}&apikey=3a8de144`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
                        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="Image not Found">
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${details.Title}</h3>
                        <ul class="movie-misc-info">
                            <li class="year">Year: ${details.Year}</li>
                            <li class="rated">Rating: ${details.Rated}</li>
                            <li class="released">Released on: ${details.Released}</li>
                        </ul>
                        <p class="genre">
                            <b>Genre:</b>${details.Genre}
                        </p>
                        <p class="writers">
                            <b>Writers:</b>${details.Writer}
                        </p>
                        <p class="actors">
                            <b>Actors:</b>${details.Actors}
                        </p>
                        <p class="plot">
                            <b>Plot:</b>${details.Plot}
                        </p>
                        <p class="language">
                            <b>Language:</b>${details.Language}
                        </p>
                        <p class="awards">
                            <b><i class = "fas fa-award"></i></b>${details.Awards}
                        </p>
                    </div>
    `;
}
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});