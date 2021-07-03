
$(function() {
    var mid = window.location.search.substring(1).replace("movieid=","")
    function fetchMovieData(movieid) {
        fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US`,{headers: {
    Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
    "Content-Type": "application/json;charset=utf-8"}}).then(res =>res.json()).then(data => {
            const {title,overview,release_date,runtime,vote_average,video} = data
            document.querySelector("h1.title").innerHTML = title
            document.querySelector("p#releasedate").innerHTML = `Release Date: ${release_date}`
            document.querySelector("p#duration").innerHTML = `Duration: ${runtime} mins`
            document.querySelector("p.synopsis").innerHTML = overview
            getVideo(movieid)
        }).catch(err => console.log(err))
    }
    function getCast(movieid) {
        fetch(`https://api.themoviedb.org/3/movie/${movieid}/credits?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US`,{headers: {
    Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
    "Content-Type": "application/json;charset=utf-8"}}).then(res =>res.json()).then(data => {
        const {cast} = data
        cast.map(actor => {
            const {name,profile_path,character} = actor
            let actorcard = "<row>"
            actorcard += `<div class="artist"><p>${name}</p>
                    <p class="character"><lower>as </lower>${character}</p></div>`
            actorcard += `<img class="artist_icon" src="https://image.tmdb.org/t/p/w500/${profile_path}" alt="${name}"></row>`
            document.querySelector("div.cast").innerHTML += actorcard
        })
    })
    }
    function getVideo(movieid) {
        fetch(`https://api.themoviedb.org/3/movie/${movieid}/videos?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US`).then(res=>res.json())
        .then(movie => {
            const {key} = movie.results[0]
            $("iframe").attr("src",`https://www.youtube.com/embed/${key}`)
        })
    }
    function saverecentview(id) {
        // recentview = ["",""]
        let recentviewlist = new Array;
        let recentview = localStorage['recentview'];
        if (recentview == undefined) {
            recentviewlist.push("0")
            recentviewlist.push(id)
        }
        else {
            recentviewlist = JSON.parse(recentview)
            if (!recentviewlist.includes(id)) {
                recentviewlist.push(id)
            }
        }
        localStorage["recentview"] = JSON.stringify(recentviewlist)
    }
    fetchMovieData(mid)
    getCast(mid)
    saverecentview(mid)
})
