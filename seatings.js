
var ticket_quantity = 0
var selectedseats = new Array;
// ticket price updating of total price
function changeTotalPrice(qty) {
    if (qty == 0) {
        $("td.quantity").text("0");
        $("td.ticket_price").text("0.00");
        $(".total_price").text("0.00")
    }
    else {
        $("td.quantity").text(`${qty}`);
        $("td.ticket_price").text(`${qty*7.00}.00`);
        $(".total_price").text(`${qty*7.00}.00`) 
    }
    
}
function changeSeat(ele) {
    $(ele).toggleClass("selected_seat");
    let seatnumber = $(ele).attr("seatno")
    if ($(ele).hasClass("selected_seat")) {
        selectedseats.push(seatnumber)
    }
    else {
        selectedseats = selectedseats.filter(v => v !== seatnumber)
    }
    ticket_quantity = $(".seat.selected_seat").length-1
    if (ticket_quantity == 0) {
        $("td#seatselected").text("-")
    }
    else {
        seats = selectedseats.toString()
        $("td#seatselected").text(seats)
    }
    changeTotalPrice(ticket_quantity)
}
$("button.quantity_minus").click(() => {
    if (ticket_quantity >= 1) {
        ticket_quantity -= 1;
        changeTotalPrice(ticket_quantity);
    }
})
$("button.quantity_plus").click(() => {
    if (ticket_quantity <= 10) {
        ticket_quantity += 1;
        changeTotalPrice(ticket_quantity);
    }
})
$(function() {
    // save ticket onsubmit
    function fetchMovieData(movieid) {
        fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US`,{headers: {
    Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
    "Content-Type": "application/json;charset=utf-8"}}).then(res =>res.json()).then(data => {
            const {title} = data
            document.querySelector("td#moviename").innerText = title
        }).catch(err => console.log(err))
    }
    function saveticket(id,selectedseats) {
        // boughttickets = [{},{}]}
        let date = $("#date").text()
        let time = $("div.movietime.alive").text()
        let location = $("#movielocation").val()
        let boughttickets = localStorage["boughttickets"]
        let boughtticketlist = new Array;
        const ticket = {id,date,time,selectedseats,location}
        if (boughttickets == undefined) {
            boughtticketlist.push("0")
            boughtticketlist.push(ticket)
        }
        else {
            boughtticketlist = JSON.parse(boughttickets)
            if (!boughtticketlist.includes(ticket)) {
                boughtticketlist.push(ticket)
            }
        }
        localStorage["boughttickets"] = JSON.stringify(boughtticketlist)
    }
    const movieid = window.location.search.substring(1).replace("movieid=","")
    fetchMovieData(movieid)
    $("button.checkout").click(() => saveticket(movieid,selectedseats))
}) 

