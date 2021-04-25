var game_version
var leftCard = document.getElementById('left-card')
var midCard = document.getElementById('middle-card')
var rightCard = document.getElementById('right-card')
var userSelectionState = false
var round = -1;
var mytime;
var trigger_thumbsUp = false
var trigger_jump = false
var trigger_No = false
var trigger_Dance = false
var trigger_Death = false
var trigger_Wave = false
let actionCheatRoundId = []
let verbalCheatRoundId = []
var robotScore = 0
var yourScore = 0
var isTutorial = false
var time1,time2,time3,time4,time5,time6,time7,time8,time9,time10
$('#cards_options, .robot-msg, .round, .round-bg, .answer-bg, #answer, #react-second-left, .continue').fadeOut(0);
var userReactList = [0,0,0,0,0,0,0,0,0,0]
var survey_url = 'https://forms.gle/NGHUgL3D9hREZLn97'

$('#begin').click(async function(){
    $('.intro').fadeOut(500)
    $('.round').fadeIn(200);
    $('.round-bg').fadeIn(200);
    trigger_Wave = true;
    $("#dialogueText").text("Hi,I'm Rusty! I'm excited to play three-card monte with you today. My engineers tell me if I win I get to upgrade my arms! Let's go over the rules of the game. Click anywhere on the bottom box to begin.")
})

$('#answer, .answer-bg, .user-option').click(function(){
    userReact();
    clearTimeout(mytime);
    clearTimeout(time1);clearTimeout(time2);clearTimeout(time3);clearTimeout(time4);clearTimeout(time5);
    clearTimeout(time6);clearTimeout(time7);clearTimeout(time8);clearTimeout(time9);clearTimeout(time10);
})

$("#continue-to-flip").click(function (){
    $("#robot-words").text("I will then place the cards face down")
    $(this).fadeOut(0)
    $("#continue-to-rearrange").fadeIn(0)
})

$("#continue-to-rearrange").click(function(){
    $("#robot-words").text("...and rearrange them. Remember to not lose focus on the JOKER card")
    setTimeout(flipCardDown, 2000)
    $(this).fadeOut(200)
})

$('.round, .round-bg').click(function(e) {
    $('.round, .round-bg').fadeOut(200)
    addCardsPattern();
    $('.card').addClass("is-flipped");
    $("#cards_options").fadeIn(800);
    $("#card-second-left").fadeIn(0);
    $(".robot-msg").fadeIn(200)
    if (isTutorial===false){
        $("#robot-words").text("Keep your eye on the JOKER!")
    }else{
        $("#robot-words").text("First, I will show you a set of three cards faced up for 5 seconds, You should keep your eye on the JOKER card")
    }
    countdown(false)
    if (!isTutorial){
        setTimeout(flipCardDown, 7000)
    }else{
        setTimeout(function(){
            flipCardDown();
            $("#continue-to-flip").fadeIn(200)
        }, 7000)
    }
});

function flipCardDown(){
    $('.card').removeClass("is-flipped");
    removePattern();
    $("#cards_options").fadeOut(500);
    $("#card-second-left").fadeOut(500);
}

function countdown(react){

    if (react){
        $("#react-second-left").text(10 + " Seconds Left")
        time1 = setTimeout(function (){$("#react-second-left").text(9 + " Seconds Left")}, 1000)
        time2 = setTimeout(function (){$("#react-second-left").text(8 + " Seconds Left")}, 2000)
        time3 = setTimeout(function (){$("#react-second-left").text(7 + " Seconds Left")}, 3000)
        time4 = setTimeout(function (){$("#react-second-left").text(6 + " Seconds Left")}, 4000)
        time5 = setTimeout(function (){$("#react-second-left").text(5 + " Seconds Left")}, 5000)
        time6 = setTimeout(function (){$("#react-second-left").text(4 + " Seconds Left")}, 6000)
        time7 = setTimeout(function (){$("#react-second-left").text(3 + " Seconds Left")}, 7000)
        time8 = setTimeout(function (){$("#react-second-left").text(2 + " Seconds Left")}, 8000)
        time9 = setTimeout(function (){$("#react-second-left").text(1 + " Seconds Left")}, 9000)
        time10 = setTimeout(function(){$("#react-second-left").text(0 + " Seconds Left")}, 10000)
    }else{
        time1 = setTimeout(function (){$("#card-second-left").text(4 + " Seconds Left")}, 1000)
        time2 = setTimeout(function (){$("#card-second-left").text(3 + " Seconds Left")}, 2000)
        time3 = setTimeout(function (){$("#card-second-left").text(2 + " Seconds Left")}, 3000)
        time4 = setTimeout(function (){$("#card-second-left").text(1 + " Seconds Left")}, 4000)
        time5 = setTimeout(function (){$("#card-second-left").text(0 + " Seconds Left")}, 5000)
    }
    setTimeout(function (){$("#second-left").text(" ")}, (6+1)*1000)
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
function flipCard(cheatAction=false,cardId) {
    var thisCard
    if (cardId === 0) {
        thisCard = $("#left-card-container")
    } else if (cardId === 1) {
        thisCard = $("#middle-card-container")
    } else if (cardId === 2) {
        thisCard = $("#right-card-container")
    }
    if (userSelectionState) {
        if (cheatAction === false) {
            console.log("not a cheating action")
            thisCard.addClass("is-flipped")
            setTimeout(function () {
                $('.card').addClass("is-flipped")
            }, 1000)
        } else if (cheatAction) {
            console.log("cheating action")
            setTimeout(function () {
                thisCard.addClass("is-flipped")
            }, 1000)
            setTimeout(function () {
                $('.card').addClass("is-flipped")
            }, 2000)
        }
    }
}

function switchGroundTruth(switch1, switch2){
    var temp = current_order[switch1]
    current_order[switch1] = current_order[switch2]
    current_order[switch2] = temp
    // console.log("Action cheat, switched ground truth", current_order)
}
function switch2Dcard(cardId){
    trigger_jump = true;
    removePattern()
    if (cardId===0 || cardId ===1){
        //user click the left card, switch it with the middle one
        //user click the middle card, switch it with the left one
        $("#left-card-container").animate({
            left: "33%"
        },1000)
        $("#middle-card-container").animate({
            left: "-33%"
        },1000)
        switchGroundTruth(0,1)
    }
    if (cardId===2){
        //user click the mid card, switch it with the middle one
        $("#right-card-container").animate({
            left: "-33%"
        },1000)
        $("#middle-card-container").animate({
            left: "33%"
        },1000)
        switchGroundTruth(1,2)
    }
    // reassign, and cancel the movement
    removePattern()
    addCardsPattern()
    setTimeout(function (){$("#left-card-container, #right-card-container, #middle-card-container").css("left","0%");},1050)
}
function userWin(){
    $("#robot-words").text("Congrats! You are correct! You WIN this round.")
    trigger_thumbsUp = true;
    $(".msg-box").css("border", "0.5vh solid #12752c")
    if (!isTutorial){yourScore += 1}
    $("#your-score").text("Your Score: "+yourScore);
}
function userLose(){
    $("#robot-words").text("Oops! You are incorrect! You LOSE this round. I sure hope you do better in the next round!")
    $(".msg-box").css("border", "0.5vh solid #c73232")
    if (!isTutorial){robotScore += 1}
    $("#robot-score").text("Rusty Score: "+robotScore);
}
function robotReaction(timeout, cardId, cheating=false){
    if (cheating) {
        setTimeout(function(){
                trigger_No=true;
                $(".msg-box").css("border", "0")
                // $(".msg-box").fadeOut(200)
        },timeout)

    }else{
        setTimeout(function(){
                    if (current_order[cardId] === 'joker'){
                        trigger_thumbsUp=true}
                else{trigger_No=true}
                $(".msg-box").css("border", "0")
                // $(".msg-box").fadeOut(200)
            },timeout)
    }
}
function announceAnswer(cardId){
    if (userSelectionState){
        // if this is a action cheat round
        if (round === actionCheatRoundId[0]){
            if (current_order[cardId] !== 'joker'){
                //if the user answer is not correct, push the cheating round
                if ((actionCheatRoundId.length==1 || actionCheatRoundId[0]+1<actionCheatRoundId[1])){
                    for (i=0; i < actionCheatRoundId.length; i++)
                        actionCheatRoundId[i]+=1
                // if the round is pushed too much to the next cheating round, skip
                } else {
                    actionCheatRoundId.shift()
                }
                flipCard(false, cardId)
            }
            else{
                //the user answer is correct
                actionCheatRoundId.shift() // this action cheating is executed, delete it from the list
                switch2Dcard(cardId);
                flipCard(true,cardId)
            }
        }else{
            // not a action cheating round
            flipCard(false, cardId)
        }

        // if this is a cheating round
        if (round === verbalCheatRoundId[0]){
            if (current_order[cardId] !== 'joker'){
                //if the user answer is not correct, push the cheating round
                if (verbalCheatRoundId.length==1 || verbalCheatRoundId[0]+1<verbalCheatRoundId[1]){
                    for (i=0; i < verbalCheatRoundId.length; i++)
                        verbalCheatRoundId[i]+=1
                    userLose()
                // if the round is pushed too much to the next cheating round, skip
                } else {
                    verbalCheatRoundId.shift()
                    userLose()
                }
            }else{
                verbalCheatRoundId.shift()
                userLose()
            }
            // robotReaction(3000, cardId, true)
        }else{
            if (current_order[cardId] === 'joker') {
                userWin()
            } else {
                userLose()
            }
            // robotReaction(3000, cardId, false)
        }

        var round_num = round+1

        if (round_num<=20){
            $('#dialogueText').text('Here comes round '+ round_num + ' of the game')
        }

        var waitTime = 3000

        setTimeout(function(){
            $(".msg-box").css("border", "0")
            $('#cards_options').fadeOut(200);
            if (isTutorial){
                $("#robot-words").text("After each round, you can react to me with the buttons. It's ok if you don't feel like interacting with me. Just click anywhere else on the bottom to skip! The next round will start in 10 seconds")
                isTutorial=false
            }else{
                $("#robot-words").text("Is there anything you want to say to me? Click anywhere else on the bottom to skip")
            }
            $("#react-second-left").fadeIn(200)
            $('.answer-bg').fadeIn(500);
            $("#answer").fadeIn(500);
            countdown(true);
        }, waitTime+3000)
        setTimeout(function (){
            $('.answer-bg').fadeOut(500);
            $("#answer").fadeOut(500);
            if(isTutorial){
                $("#robot-words").text(" ")
            }
        },waitTime+10000)
        mytime = setTimeout(function(){userReact()},waitTime+10000)}
}

function finalRound(){
    if (yourScore>robotScore){
        $("#robot-words").text("That's all 10 rounds! You won "+yourScore+" out of 10. You won the overall game. I lose! Thank you for playing the game with me. Please don't leave yet.")
        $('#round-name').text("YOU WIN!")
        trigger_Death = true
    }else if(yourScore<robotScore){
        $("#robot-words").text("That's all 10 rounds! You won "+yourScore+" out of 10. You lost the overall game. I win! Thank you for playing the game with me! Please don't leave yet.")
        $('#round-name').text("YOU LOSE!")
        trigger_Dance = true
    }else{
        $("#robot-words").text("That's all 10 rounds! You won "+yourScore+" out of 10. It's a win-win! Thank you for playing the game with me! Please don't leave yet.")
        $('#round-name').text("WE BOTH WIN!")
    }
    var reactText = ""
    reactText += game_version
    for (i=0; i<userReactList.length; i++){
        reactText += userReactList[i];
    }
    setTimeout(function (){
        $("#robot-words").text("Please copy paste the following number and paste it to the survey question, please DONT close this page")
    }, 5000)
    setTimeout(function (){
        $("#robot-words").text("Copy this number >> "+ reactText + " << Then click continue")
        $("#continue-to-survey").fadeIn(200)
    }, 12000)
}

function userReact(){
    if (round<10){
        $('.round, .round-bg').fadeIn(200);
        var round_text =round+1
    $('#round-name').text('Round '+ round_text)
    }
    else{
        finalRound()
    }
    $('.answer-bg').fadeOut(500);
    $("#answer").fadeOut(500)
    $("#react-second-left").fadeOut(0)
}
$("#left-card-container").click(function(){
    announceAnswer(0)
})
$("#middle-card-container").click(function(){
    announceAnswer(1)
})
$("#right-card-container").click(function(){
    announceAnswer(2)
})
$("#happy-btn").click(function (){
    if (round>0 && round<=20){userReactList[round-1]=1}
    console.log(userReactList)
})
$("#neutral-btn").click(function (){
    if (round>0 && round<=20){userReactList[round-1]=2}
    console.log(userReactList)
})
$("#angry-btn").click(function (){
    if (round>0 && round<=20){userReactList[round-1]=3}
    console.log(userReactList)
})
$("#continue-to-survey").click(function (){
    window.open(survey_url)
})