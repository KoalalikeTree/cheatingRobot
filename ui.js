$('#cards').fadeOut(0);

$('.card-option').click(async function(){
    $('#cards').fadeOut(500)
    $( '#msgbox' ).fadeIn(500); //jquery
    $( '#answer' ).fadeIn(500);

})
$('.user-option').click(function(){
    $( '#msgbox' ).fadeOut(200)
    $('#answer').fadeOut(200)
    $('.game-title').fadeIn(200);
})
