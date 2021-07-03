const boughttickets = localStorage["boughttickets"]
const recentview = localStorage["recentview"]

// recentview = ["",""],boughttickets = [{id,date,time,selectedseats,location},{}]}
if (boughttickets !== undefined) {
    let tickets = JSON.parse(boughttickets)
    tickets.splice(1).map(ticket => {
        const {id,date,time,selectedseats,location} = ticket
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US`,{headers: {
            Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
            "Content-Type": "application/json;charset=utf-8"}})
        .then(res => res.json())
        .then(data => {
            const {title,poster_path,backdrop_path} = data
            document.querySelector("#yourtickets").innerHTML += `
            <div class="tickets_cards" onclick="loadTicket('${title}',3,'${date}','${selectedseats}','${time}','${location}','https://image.tmdb.org/t/p/original/${backdrop_path}')">
            <img src='https://image.tmdb.org/t/p/w500/${poster_path}' alt="${title}"></div>`
        }) 
    })
}
if (recentview !== undefined) {
    let recentmovies = JSON.parse(recentview)
    recentmovies.splice(1).map(movieid => {
        fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US`,{headers: {
        Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
        "Content-Type": "application/json;charset=utf-8"}})
        .then(res => res.json())
        .then(data => {
            const {name,poster_path,overview} = data
            document.querySelector("#recentview").innerHTML += `<div class="recentview_cards"><img src='https://image.tmdb.org/t/p/w500/${poster_path}' alt="${name}"></div>`
        })
    })
}
function loadTicket(name,theatre,date,selectedseats,time,location,backgroundimage) {
    document.querySelector("div.ticket_display").classList.add("view_ticket");
    if (document.querySelector("div.ticket_display").classList.contains("view_ticket")) {
        $("div.ticket_display").css({background:`linear-gradient(0deg, rgba(2,0,36,0.4) 0%, rgba(194,194,194,0.2) 54%, rgba(224,234,236,0) 100%),url('${backgroundimage}') no-repeat`,"mask-image": "url('images/ticket_mask.svg')","background-size": "cover","background-position": "center"})
        document.querySelector("div.ticket > .title").innerText = name
        document.querySelector(".ticketlocation").innerText = location
        document.querySelector("div.ticket > #theatre").innerText = `theatre ${theatre}`
        document.querySelector("div.ticket > .day").innerText = date
        document.querySelector("div.ticket #seat").innerText = selectedseats.toString()
        document.querySelector("div.ticket #time").innerText = time
    }
}
$(function() {
    // TICKET DISPLAY close ticket
    $("button.close_ticket").click(() => {
        $("div.ticket_display").removeClass("view_ticket");
    })
})