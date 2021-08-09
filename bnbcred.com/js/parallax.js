$('.top-block').mousemove(function(e) {
    const x = e.pageX / $(window).width()
    const y = e.pageY / $(window).height()
    const speed = [
        [50, 30],
        [80, 50],
        [30, 10],
        [60, 50],
        [50, 80],
        [100, 40],
        [10, 100]
    ]
    speed.map((speed, index) => {
        $(`.parallax-tron img:nth-child(${index+1})`).css('transform', `translate(${-speed[0]*x}px,${-speed[1]*y}px)`)
    })
})