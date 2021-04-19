$('#cards_options').fadeOut(0);

$('#begin').click(async function(){
    $('.intro').fadeOut(500)
    $('.round').fadeIn(200);
    $('.round-bg').fadeIn(200);
})

$('.user-option').click(function(){
    $( '#msgbox' ).fadeOut(200)
    $('#answer').fadeOut(200)
    $('.round').fadeIn(200);
})

$(window).click(function(e) {
    if($('.round, .round-bg').css('display')==='block'){
        $('.round, .round-bg').fadeOut(200)
    }
});

$(".card").click(function(){
    $(this).addClass("is-flipped")
    setTimeout(function(){$('.card').addClass("is-flipped")},1000)
})
