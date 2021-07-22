
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
function closedialog() {
    document.querySelector("#errormessage").removeAttribute("open")
}
$(function() {
    const url = window.location.search.substring(1).split("&")
    const movieid = url[0].replace("movieid=","")
    const editcart = url[1].replace("editcart=","")
    // save ticket onsubmit
    function fetchMovieData(movieid) {
            fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=d91191ac19f5d37cd9975eb87666a286&language=en-US`,{headers: {
    Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTExOTFhYzE5ZjVkMzdjZDk5NzVlYjg3NjY2YTI4NiIsInN1YiI6IjYwZGE4OTNmMGI3MzE2MDA3ZDFkOTExNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MQ1jAAXQ7eXStlY8kSTMdGp1Q26J2U8y9yr2rqCl1-I",
    "Content-Type": "application/json;charset=utf-8"}}).then(res =>res.json()).then(data => {
            const {title} = data
            document.querySelector("td#moviename").innerText = title
        }).catch(err => console.log(err))
    }
    function loadFromSS(movieid) {
        const data = JSON.parse(sessionStorage.cart)
        data.map(movie => {
            if (movie.id === movieid) {
                const {title,date,time,selectedseats:ssSeatsArray,location,price} = movie
                // change title
                document.querySelector("td#moviename").innerText = title
                // load ticket price and qty
                ticket_quantity = price/7
                changeTotalPrice(ticket_quantity)
                // load selected seats
                selectedseats = ssSeatsArray
                selectedseats.map(seat => {
                    const element = $(`div.seat[seatno='${seat}']`)
                    element.addClass("selected_seat")
                })
                seats = selectedseats.toString()
                $("td#seatselected").text(seats)
                // load movie location
                $("option[name='movielocation']").removeAttr("selected")
                $(`option[value='${location}']`).attr("selected",true)
            }
        })
    }
    function addToCart(id,selectedseats) {
        // boughttickets = [{},{}]}
        const date = $("#date").text()
        const time = $("div.movietime.alive").text()
        const location = $("#movielocation").val()
        const price = $(".total_price").text()
        const title = $("#moviename").text()
        let boughttickets = sessionStorage["cart"]
        let boughtticketlist = new Array;
        const ticket = {id,title,date,time,selectedseats,location,price}
        if (boughttickets !== undefined) {
            // remove identical movieid in sessionStorage
            boughtticketlist = JSON.parse(boughttickets)
            boughtticketlist = boughtticketlist.filter(ele => {
                return (ele.id !== id)
            })
        }
        boughtticketlist.push(ticket)
        sessionStorage["cart"] = JSON.stringify(boughtticketlist)
    }
    function saveticket(id,selectedseats) {
        // boughttickets = [{},{}]}
        let date = $("#date.alive").text()
        let time = $("div.movietime.alive").text()
        let location = $("#movielocation").val()
        let boughttickets = localStorage["boughttickets"]
        let boughtticketlist = new Array;
        const ticket = {id,date,time,selectedseats,location}
        if (boughttickets == undefined) {
            
            boughtticketlist.push(ticket)
        }
        else {
            boughtticketlist = JSON.parse(boughttickets)
            boughtticketlist = boughtticketlist.filter(ele => {
                return (ele.id !== id && ele.date !== date && ele.time !== time && ele.location !== location)
            })
            boughtticketlist.push(ticket)
        }
        localStorage["boughttickets"] = JSON.stringify(boughtticketlist)
    }
    if (editcart == "true") {
        loadFromSS(movieid)
    }
    else {
        fetchMovieData(movieid)
    }
    $("button.checkout").click((e) => {
        if (selectedseats.length == 0 || movieid == "") {
            e.preventDefault()
            let texttoadd = ""
            if (selectedseats.length == 0) {
                texttoadd += "Please select a seat"
            }
            if (movieid == "") {
                if (texttoadd !== "") {
                    texttoadd += "<br>Please select a movie"
                }
                else {
                    texttoadd += "Please select a movie"
                }
            }
            texttoadd += "<button class='closedialog' onclick='closedialog()'>X</button>"
            document.querySelector("#errormessage").innerHTML = texttoadd
            document.querySelector("#errormessage").setAttribute("open",true)
        }
        else {
           saveticket(movieid,selectedseats) 
        }
        addToCart(movieid,selectedseats)
    })
}) 