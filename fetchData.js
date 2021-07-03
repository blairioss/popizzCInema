function toggleClass(element,classname) {
    element.classList.toggle(classname)
}
$(function() {
    const headerDisplay = document.querySelector("div#headercard")
    const nowPlayingDisplay = document.querySelector("div.onscreen_display")
    const comingSoonDisplay = document.querySelector("div.comingsoon_display")
    // toggle expanded class to extend home menu botton
    $("button.toggle_menu").click(() => {
        toggleClass(document.querySelector("div.homemenu"),"expanded");
    });
function addToCard(element,classname,title,overview,vote_average,poster_path,release_date,id,cardid=0) {
    release_date = release_date==undefined?"TBC":release_date
    if (cardid >= 1) {
        element.innerHTML += `<div id=${cardid} class=${classname} onclick="toggleClass(this,'viewing')"}>
        <img src='https://image.tmdb.org/t/p/w500/${poster_path}' alt='${title}'>
        <div class="overlay">
            <h1 class="title">${title}</h1>
            <h2 class="subtitle">Release Date: <br> ${release_date}</h2>
            <h3 class="subtitle">Popularity: ${vote_average}</h3>
            <p class="card_description">${overview}</p>
            <span>
            <button><a href="/movie.html?movieid=${id}" class="movie_detail">read more</a></button>
            <button><a href="./seatings.html?movieid=${id}" class="get_ticket">Book Tickets</a></button></span>
        </div></div>`
    }
    // parse nowPlayingCards
    else if (classname == "onscreen_card") {
        element.innerHTML += `<div class=${classname} onclick="toggleClass(this,'viewing')">
    <img src='https://image.tmdb.org/t/p/w500/${poster_path}' alt='${title}'>
    <div class="overlay">
        <h1 class="title halfsize">${title}</h1>
        <h3 class="subtitle halfsize">Release Date: <br> ${release_date}</h3>
        <h3 class="subtitle halfsize">Popularity: ${vote_average}</h3>
        <p class="card_description halfsize">${overview}</p>
        <span>
            <button class="halfsize"><a href="./movie.html?movieid=${id}" class="movie_detail">read more</a></button>
            <button class="halfsize"><a href="./seatings.html?movieid=${id}" class="get_ticket">Book Tickets</a></button></span>
    </div>
    </div>`
    }
    // parse comingSoonCards
    else if (classname == "comingsoon_cards") {
        element.innerHTML += `<div class=${classname}><img src='https://image.tmdb.org/t/p/w500/${poster_path}' alt='${title}' /></div>`
    }
}
// return movies from popular, upcoming and onscreens 
function fetchData(isHome) {
    if (isHome) {
        // fetch popular movies
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US&page=1",{headers: {
        Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
        "Content-Type": "application/json;charset=utf-8"}}).then(res => res.json())
        .then(data => {
            let cardid = 1
            data.results.slice(0,6).map(movie => {
                const {poster_path,overview,title,vote_average,release_date,id} = movie
                addToCard(headerDisplay,"card",title,overview,vote_average,poster_path,release_date,id,cardid)
                cardid += 1
            })
        })
        // fetch coming soon movies
        fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US&page=1",{headers: {
            Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
            "Content-Type": "application/json;charset=utf-8"}}).then(res => res.json())
        .then(data => {
            data.results.slice(0,6).map(movie => {
                const {poster_path,overview,title,vote_average,release_date,id} = movie
                addToCard(comingSoonDisplay,"comingsoon_cards",title,overview,vote_average,poster_path,release_date,id)
            })
        })
    }
    // fetch now playing movies
    fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US&page=1",{headers: {
        Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
        "Content-Type": "application/json;charset=utf-8"}}).then(res => res.json())
    .then(data => {
        data.results.map(movie => {
            const {poster_path,overview,title,vote_average,release_date,id} = movie
            addToCard(nowPlayingDisplay,"onscreen_card",title,overview,vote_average,poster_path,release_date,id)
        })
    })
}
// search for movie based on keywords
function findMovie(name) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US&query=${name}&page=1&include_adult=false&year=2021&primary_release_year=2021`,{
        headers: {Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
        "Content-Type": "application/json;charset=utf-8"
    }}).then(res => {
        if (res.ok) {
            return res.json()
        }
    })
    .then(data => {
        if (data.results.length == 0) {
            console.log("no movies found")
        }
        else {
        document.querySelector("div.onscreen_display").innerHTML = ""
        data.results.map(movie => {
            const {title,overview,poster_path,id,release_date,vote_average} = movie
            document.querySelector("div.onscreen_display").innerHTML += `<div class='onscreen_card' onclick="toggleClass(this,'viewing')">
            <img src='https://image.tmdb.org/t/p/w500/${poster_path}' alt='${title}'>
            <div class="overlay">
                <h1 class="title">${title}</h1>
                <h2 class="subtitle">Release Date: <br> ${release_date}</h2>
                <h3 class="subtitle">Popularity: ${vote_average}</h3>
                <p class="card_description">${overview}</p>
                <span>
                    <button><a href="/movie.html?movieid=${id}" class="movie_detail">read more</a></button>
                    <button><a href="./seatings.html?movieid=${id}" class="get_ticket">Book Tickets</a></button></span>
            </div>
            </div>`
        })}
    }).catch(error => {
        console.log(error)
    })
}
// set transform origin of onscreen cards
function setTransformOrigin() {
    if (document.querySelectorAll("div.onscreen_card").length % 2 !== 0 && document.querySelectorAll("div.onscreen_card").length !== 2) {
        $("div.onscreen_card:last-of-type").css({"transform-origin":"top right"})
    } else {
        $("div.onscreen_card:last-of-type").css({"transform-origin":"bottom right"})
    }
}
// fetch movie data in 
if (document.querySelectorAll(".display-container") == undefined) {
    fetchData(false)
    document.querySelector("input.search_bar").onchange = function(event) {
        findMovie(event.target.value)
    }
}
else {
    fetchData(true)
}
setTransformOrigin()
})