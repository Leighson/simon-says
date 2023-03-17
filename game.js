// instantiate storage for game state and user choices
var gamePattern = [];
var userPattern = [];
var currentLevel = 0;
var clickCount = 0;


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

// create animator object for game over event
function gameOverAnimation() {

    // activate background color for game-over state
    $("#level-title").text("Game Over");
    $("body").toggleClass("game-over");

    // delay for 1s
    setTimeout( () => {
        $("body").toggleClass("game-over");
        $("#level-title").text("Press A Key to Start");
    }, 1000);

    // reset game state
    gamePattern = [];
    userPattern = [];
    currentLevel = 0;
    clickCount = 0;

}

// define "next level" procedure on [user click] or [keyboard press]
function nextLevel() {

    // reset user pattern storage and increase level
    userPattern = [];
    currentLevel++;

    // change title to reflect current level
    $("#level-title").text(`Level ${currentLevel}`);
    $("#reset-page").css("visibility", "visible");

    // generate random number and colour list and append to game pattern
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

}


/* EVENT HANDLING ********************************************************/


// reset page on "a" press || reload page on "r" press
function handleKeyPress(event) {

    // if the game is on the landing page and if the key pressed is "a", then start the game...
    // otherwise, check if the key pressed is "r" and reload to landing page
    if (currentLevel < 1 && event.key.toLowerCase() === "a") {
        nextLevel();
        console.log("KeyPressed: " + event.key);
        console.log("NextColour: " + gamePattern[currentLevel-1]);
    } else if (event.key.toLowerCase() === "r") {
        console.log("KeyPressed: " + event.key);
        window.location.reload();
    }

}

// reset 
function handleButtonClick(event) {

    if (currentLevel !== 0) {

        // increase click count
        clickCount++;

        // trigger pressed animation
        buttonAnimation(event);

        // save user choice into userPattern storage
        var userChosenColour = event.target.id;
        userPattern.push(userChosenColour);

        // check the user input against the game pattern
        console.log("Chosen colour: " + userChosenColour);
        console.log("---");
        console.log("Click count: " + clickCount);
        console.log("Is the chosen colour correct? " + (userChosenColour === gamePattern[clickCount-1]));
        console.log("---");

        // check if the user pattern is still incomplete AND if user input is the same as the game pattern
        // if so, go to the next level, otherwise, it's game over and the game resets
        if (userChosenColour === gamePattern[clickCount-1]) {

            if (userPattern.length < gamePattern.length) {
                console.log("Choose the next colour in the pattern.")
            } else {
                clickCount = 0;
                nextLevel();
                console.log("Game Pattern: " + gamePattern);
                console.log("NextColour: " + gamePattern[currentLevel-1]);
            }

        } else {

            // trigger game over screen
            gameOverAnimation();

        }

    }

}



/* MAIN SCRIPT ********************************************************/


// main
$(document).keydown(handleKeyPress);
$(".btn").click(handleButtonClick);