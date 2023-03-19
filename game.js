// instantiate storage for game state and user choices
var gamePattern = [];
var userPattern = [];
var currentLevel = 0;

// instantiate default states for game over and next level pages
var gameOver = false;
var nextLevel = false;


/* HELPER FUNCTIONS ****************************************************/
// define animations and events


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

    // activate background color for game-over state
    $("#level-title").text("Game Over");
    $("#level-subtitle").css("visibility", "visible");
    $("#level-subtitle").text("Press any key to continue");
    $("#reset-page").css("visibility", "hidden");
    $("body").toggleClass("game-over");

    // reset game state
    gamePattern = [];
    userPattern = [];
    currentLevel = 0;
    gameOver = true;

}


/* NEXT LEVEL FUNCTIONS *************************************************/


// function to wait for next level after the first level
function preNextLevelEvent() {

    // reset user pattern storage and increase level
    userPattern = [];
    currentLevel++;
    nextLevel = true;
    gameOver = false;

    // change title to reflect current level
    if (currentLevel > 1) {
        $("body").toggleClass("next-level");
        $("#level-subtitle").css("visibility", "visible");
        $("#level-subtitle").html("Press any key to continue");
    } else {
        postNextLevelEvent();
    }

}

// function for next level conditions
function postNextLevelEvent() {

    console.log("Game Pattern: " + gamePattern);
    console.log("NextColour: " + gamePattern[currentLevel-1]);

    if (currentLevel > 1) {
        $("body").toggleClass("next-level");
    }
    $("#level-title").text(`Level ${currentLevel}`);
    $("#level-subtitle").css("visibility", "visible");
    $("#reset-page").css("visibility", "visible");

    // countdown timer
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

        console.log("Level " +  currentLevel);

        nextLevel = false;
    }, 5000);

}


/* EVENT HANDLING ********************************************************/


// reset page on "a" press || reload page on "r" press
function handleKeyPress(event) {

    // if the game is on the landing page and if the key pressed is "a", then start the game...
    // otherwise, check if the key pressed is "r" and reload to landing page
    if (event.key.toLowerCase() === "a" && currentLevel === 0) {
        preNextLevelEvent();
        console.log("KeyPressed: " + event.key);
    } else if (event.key.toLowerCase() === "r") {
        console.log("KeyPressed: " + event.key);
        window.location.reload();
    } else if (nextLevel) {
        postNextLevelEvent();
        console.log("NextColour: " + gamePattern[currentLevel-1]);
    }

}

// save the chosen colour, then compare with the game state pattern
// if the pattern is correct, proceed with: 1) next level if all patterns have been completed, or 2) continue with current pattern
// if the pattern is incorrect, proceed with game over screen
function handleButtonClick(event) {

    if (currentLevel > 0 && nextLevel === false) {

        // trigger pressed animation
        buttonAnimation(event);

        // save user choice into userPattern storage
        var userChosenColour = event.target.id;
        userPattern.push(userChosenColour);

        // check the user input against the game pattern
        console.log("Chosen colour: " + userChosenColour);
        console.log("Click count: " + gamePattern.length);
        console.log("Is the chosen colour correct? " + (userChosenColour === gamePattern[userPattern.length - 1]));
        console.log("---");

        // check if the user pattern is still incomplete AND if user input is the same as the game pattern
        // if so, go to the next level, otherwise, it's game over and the game resets
        if (userChosenColour === gamePattern[userPattern.length - 1]) {

            if (userPattern.length < gamePattern.length) {
                console.log("Choose the next colour in the pattern.")
            } else {
                preNextLevelEvent();
            }

        } else {

            // trigger game over screen
            gameOverEvent();
            console.log(gameOver);

        }

    } else if (gameOver) {

        console.log("Some nonsense.")
        $("body").toggleClass(".game-over");

    }

}

function handleGlobalClick(event) {

    // check if the game is in a game over event
    if (gameOver) {
        $("body").toggleClass("game-over");
        $("#level-title").text("Press any key to restart");
        $("#reset-game").css("visibility", "hidden");

        // change game over state
        gameOver = false;
    }

    // check if the game is in a next level event
    if (nextLevel) {
        // go to next level
        preNextLevelEvent();
    }

}



/* MAIN SCRIPT ********************************************************/


// main
$(document).keydown(handleKeyPress);
$(".btn").click(handleButtonClick);