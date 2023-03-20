// instantiate storage for game state and user choices
let gamePattern = [];
let userPattern = [];
let currentLevel = 0;

// instantiate default states for game over and next level pages
let gameOver = false;
let nextLevel = false;
let allowAKey = true;



/* HELPER FUNCTIONS ****************************************************/



// create animator object for button presses
function buttonAnimation(event) {

    // activate the button's pressed state
    $(event.target).toggleClass("pressed");

    // delay for 100ms
    setTimeout( () => {
        $(event.target).toggleClass("pressed");
    }, 100);

}

// create event object for game over event
function gameOverEvent() {

    gameOver = true;
    allowAKey = false;

    // activate text & background color for game-over state
    $("#level-title").text("Game Over");
    $("#reset-game").css("visibility", "visible");
    $("body").toggleClass("game-over");

}



/* NEXT LEVEL FUNCTIONS *************************************************/



// function to wait for next level after the first level
function preNextLevelEvent() {

    nextLevel = true;
    allowAKey = true;

    // reset user pattern storage and increase level
    userPattern = [];
    currentLevel++;
    console.log("Level " + currentLevel);

    // change title to reflect current level
    if (currentLevel >= 2) {
        $("body").toggleClass("next-level"); // toggle green background on
        $("#level-subtitle").css("visibility", "visible");
        $("#level-subtitle").html("Press A key to continue");
        $("#reset-game").css("visibility", "hidden");
    } else {
        postNextLevelEvent(); // skip to post next level event
    }

}

// function for next level conditions
function postNextLevelEvent() {

    allowAKey = false;

    if (currentLevel >= 2) {
        $("body").toggleClass("next-level"); // toggle green background off
    }

    $("#level-title").text(`Level ${currentLevel}`);

    // countdown timer
    $("#level-subtitle").css("visibility", "visible");
    $("#level-subtitle").text(3);

    setTimeout( () => {
        $("#level-subtitle").text(2);
    }, 1000)

    setTimeout( () => {
        $("#level-subtitle").text(1);
    }, 2000)

    setTimeout( () => {
        $("#level-subtitle").text("GO!");
    }, 3000)

    setTimeout( () => {
        $("#level-subtitle").css("visibility", "hidden");
    }, 4000)

    // generate random number and colour list and append to game pattern
    setTimeout( () => {
        var randomNumber = Math.floor(Math.random() * 4);
        var buttonColours = ["red", "blue", "green", "yellow"];
        var randomChosenColour = buttonColours[randomNumber];
        gamePattern.push(randomChosenColour);

        // play audio cue
        var audio = new Audio(`./sounds/${randomChosenColour}.mp3`);
        audio.play();

        // animate next pattern
        $(`#${randomChosenColour}`).animate({opacity: 0.10}, 75);
        $(`#${randomChosenColour}`).animate({opacity: 1.00}, 75);

        $("#reset-game").css("visibility", "visible");

        nextLevel = false; // turns ON click events and 'a' press key

        console.log("Game Pattern: " + gamePattern);

    }, 4100);

}



/* EVENT HANDLING ********************************************************/



function handleKeyPress(event) {

    // if the game is on the landing page and if the key pressed is "a", then start the game...
    // if the game is on the next level page, only the key 'a' can be pressed
    // otherwise, check if the key pressed is "r" and reload to landing page
    switch(event.key.toLowerCase()) {

        case 'r':
            if (gameOver === true || nextLevel == false) {
                window.location.reload();
                break;
            } else {
                break;
            }

        case 'q':
            $("#green").click();
            break;

        case 'w':
            $("#red").click();
            break;

        case 'a':
            if (allowAKey === true) {
                console.log("Pressed A key...");
                if (currentLevel === 0) {
                    preNextLevelEvent();
                    break;
                } else if (nextLevel === true) {
                    postNextLevelEvent();
                    break;
                }
            } else {
                $("#yellow").click();
                break;
            }

        case 's':
            $("#blue").click();
            break;

        default:
            break;

    }

}

// save the chosen colour, then compare with the game state pattern
// if the pattern is correct, proceed with: 1) next level if all patterns have been completed, or 2) continue with current pattern
// if the pattern is incorrect, proceed with game over screen
function handleButtonClick(event) {

    if (currentLevel > 0 && nextLevel === false && gameOver == false) { // only registers clicks after next level event finishes

        // trigger pressed animation
        buttonAnimation(event);

        // save user choice into userPattern storage
        var userChosenColour = event.target.id;
        userPattern.push(userChosenColour);
        console.log("User Pattern: " + userPattern);

        // check if the user pattern is still incomplete AND if user input is the same as the game pattern
        // if so, go to the next level, otherwise, it's game over and the game resets
        if (userChosenColour === gamePattern[userPattern.length - 1]) {

            // play chosen colour audio cue
            var audio = new Audio(`./sounds/${userChosenColour}.mp3`);
            audio.play();

            // proceed with current level or next level if user guessed the last colour in the game pattern
            if (userPattern.length < gamePattern.length) {
                console.log("Choose the next colour in the pattern...")
            } else {
                preNextLevelEvent();
            }

        } else {

            // play game over audio cue
            var audio = new Audio(`./sounds/wrong.mp3`);
            audio.play();

            // trigger game over screen
            gameOverEvent();

        }

    }

}



/* MAIN SCRIPT ********************************************************/



$(document).keydown(handleKeyPress);
$(".btn").click(handleButtonClick);