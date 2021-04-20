var leftCard = document.getElementById('left-card')
var midCard = document.getElementById('middle-card')
var rightCard = document.getElementById('right-card')
var userSelectionState = false
var round = 0;
var mytime;
var trigger_thumbsUp = false
var trigger_No = false
$('#cards_options, .robot-msg, .round, .round-bg, #answer').fadeOut(0);

$('#begin').click(async function(){
    $('.intro').fadeOut(500)
    $('.round').fadeIn(200);
    $('.round-bg').fadeIn(200);
})

$('.user-option').click(function(){
    userReact();
    clearTimeout(mytime);
})

$('.round, .round-bg').click(function(e) {
    $('.round, .round-bg').fadeOut(200)
    addCardsPattern();
    $('.card').addClass("is-flipped");
    $("#cards_options").fadeIn(800);
    $(".robot-msg").fadeIn(200)
    $("#robot-words").text("Please remember where the joker is")
    countdown()
    setTimeout(function(){
        $("#cards_options").fadeOut(500);
        $('.card').removeClass("is-flipped");
        removePattern();
        },
        5000)
});

function countdown(){
    $("#second-left").text("5 Seconds Left")
    setTimeout(function (){$("#second-left").text("4 Seconds Left")},1000)
    setTimeout(function (){$("#second-left").text("3 Seconds Left")},2000)
    setTimeout(function (){$("#second-left").text("2 Seconds Left")},3000)
    setTimeout(function (){$("#second-left").text("1 Seconds Left")},4000)
    setTimeout(function (){$("#second-left").text(" ")},5000)
}

function addCardsPattern(){
    leftCard.classList.add(current_order[0]);
    midCard.classList.add(current_order[1]);
    rightCard.classList.add(current_order[2]);
}

function removePattern(){
    leftCard.classList.remove(current_order[0]);
    midCard.classList.remove(current_order[1]);
    rightCard.classList.remove(current_order[2]);
}
$(".card").click(function(){
    if (userSelectionState){
        $(this).addClass("is-flipped")
        setTimeout(function(){$('.card').addClass("is-flipped")},1000)}
})

function userChoice(cardId){
    if (userSelectionState){
        if (current_order[cardId] === 'joker'){
            $("#robot-words").text("Congrats! You are correct! You win this round")
        }
        else{
            $("#robot-words").text("Oops! You are incorrect! You lose this round")
        }
        var round_num = round+1
        $('#dialogueText').text('Here comes round '+ round_num + ' of the game')
        $('#round-name').text('Round '+ round_num)
        setTimeout(function(){
            $('#cards_options').fadeOut(200);
            $('.robot-msg').fadeOut(200);
            $("#answer").fadeIn(500);
            countdown();
            if (current_order[cardId] === 'joker'){
                trigger_thumbsUp=true
            }
            else{
                trigger_No=true
            }
        }, 5000)
        setTimeout(function (){$("#answer").fadeOut(500);},10000)
        mytime = setTimeout(function(){
            userReact()
        },15000)}
}

function userReact(){
    console.log("I am here")
    $('#answer').fadeOut(200)
    $('.round, .round-bg').fadeIn(200);
}
$("#left-card-container").click(function(){
    userChoice(0)
})
$("#middle-card-container").click(function(){
    userChoice(1)
})
$("#right-card-container").click(function(){
    userChoice(2)
})
