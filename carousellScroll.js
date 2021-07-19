
$(function() {
    $("#headercard").scroll(() => {
        const containerWidth = $("#headercard").width()
        let currentPosition = Math.round($("#headercard").scrollLeft()/containerWidth) + 1
        $(".singleline.active").removeClass("active")
        $(`.singleline:nth-child(${currentPosition})`).addClass("active")
    })
})
