function toggleActiveDate(event) {
    const selectedPosition = $(event.target).position().left;
    $("div.moviedate.alive").removeClass("alive")
    $(event.target).toggleClass("alive")
    $(".date_bar").animate({left:selectedPosition},200)
}
const toggleActiveTime = (event) => {
    let timeSelectedPosition = $(event.target).position().left;
    $("div.movietime.alive").removeClass("alive")
    $(event.target).addClass("alive")
    $(".time_bar").animate({left:timeSelectedPosition}, 200)
}
$(function() {
    // animation of line bar below movie time and date scrolling
    if ($("div.movietime") != undefined) {
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        function getDay(day) {
            switch (day) {
                case 1:
                    return "Mon"
                case 2:
                    return "Tue"
                case 3:
                    return "Wed"
                case 4:
                    return "Thu"
                case 5:
                    return "Fri"
                case 6:
                    return "Sat"
                default:
                    return "Sun"
            }
        }
        function getMonth(month) {
            switch (month) {
                case 1:
                    return "Jan"
                case 2:
                    return "Feb"
                case 3:
                    return "Mar"
                case 4:
                    return "Apr"
                case 5:
                    return "May"
                case 6:
                    return "Jun"
                case 7:
                    return "Jul"
                case 8:
                    return "Aug"
                case 9:
                    return "Sep"
                case 10:
                    return "Oct"
                case 11:
                    return "Nov"
                case 12:
                    return "Dec"
            }
        }
        // update dates on display
        function parseDate(date,once) {
            let datecard = '<div class="card">'
            for (let x=0;x<4;x++) {
                let days = date.addDays(x)
                let month = getMonth(days.getMonth())
                let day = getDay(days.getDay())
                let d = days.getDate()
                datecard += `<div onclick='toggleActiveDate(event)' class="moviedate ${(x==0&&once)?'alive':''}"><span>${day}</span><span id="date">${d} ${month}</span></div>`
            }
            datecard += "</div>"
            document.querySelector(".datetime-display#datebar").innerHTML += datecard
        }
        const date = new Date()
        const date2 = date.addDays(4)
        parseDate(date,true)
        parseDate(date2,false)
        $("div.movietime").each((i,e) => {
            $(e).click((event) => toggleActiveTime(event))
        });
        let startingpos = $("div.moviedate.alive").position().left + 2;
        $(".date_bar").css("left", startingpos);
        let timestart_pos = $("div.movietime.alive").position().left + 2;
        $(".time_bar").css("left", timestart_pos);
    }
})