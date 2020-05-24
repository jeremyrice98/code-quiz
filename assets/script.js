var timeCounter = 0;
var questionCounter = 0;
var timerEl = document.getElementById("timer");
var contentHolderEl = document.querySelector(".content-holder");
var highScoreLinkEl = document.querySelector(".h-btn");

// Questions and answers
var questionArray = [{
        question: "Commonly used data types Do NOT include:",
        answerOptions: [
            "Strings",
            "Booleans",
            "Alerts",
            "Numbers",
        ],
        correctAnswer: "Alerts"
    },
    {
        question: "The condition in an if / else statement is enclosed with <span class='span'>___________________</span>.",
        answerOptions: [
            "Quotes",
            "Curly brackets",
            "Parenthesis",
            "Square brackets"
        ],
        correctAnswer: "Parenthesis"
    },
    {
        question: "Arrays in javascript can be used to store <span class='span'>___________________</span>.",
        answerOptions: [
            "Numbers and strings",
            "Other arrays",
            "Booleans",
            "All of the above",
        ],
        correctAnswer: "All of the above"
    },
    {
        question: "String values must be enclosed within <span class='span'>___________________</span> when being assigned to variables.",
        answerOptions: [
            "Curly brackets",
            "Quotes",
            "Commas",
            "Parenthesis",
        ],
        correctAnswer: "Quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answerOptions: [
            "For loops",
            "JavaScript",
            "Terminal/bash",
            "Console.log",
        ],
        correctAnswer: "Console.log"
    },
];

// Creates new element with chosen attributes
var createEl = function(elName, element, childOf, elClass, elText, elHtml, elValue, elType, elNameVal) {
    elName = document.createElement(element);
    elName.className = elClass;
    elName.textContent = elText || elHtml;
    elName.innerHTML = elHtml || elText;
    elName.value = elValue;
    elName.type = elType;
    elName.name = elNameVal;
    childOf.appendChild(elName);
    return elName;
}

// HTML DOM welcome page
var startGamePage = function() {
    contentHolderEl.innerHTML = "";
    contentHolderEl.id = "center";

    timerEl.textContent = timeCounter;

    var titleEl = createEl(titleEl, "div", contentHolderEl, "bold-text", "Coding Quiz Challenge");

    var instructionsEl = createEl(instructionsEl, "div", contentHolderEl, "default-text", "",
        "Try to answer the following code-related questions within the time limit. <br> Keep in mind that incorrect answers will penalize your score/time by ten seconds!");

    var startButtonEl = createEl(startButtonEl, "button", contentHolderEl, "btn", "Start Quiz");

    startButtonEl.addEventListener("click", startQuiz);
};

// Sets up the quiz
var startQuiz = function() {
    contentHolderEl.removeAttribute("id"); // removes css centering

    questionCounter = 0; // keeps track of question in questionArray // reset question counter

    keepTime(); // timer function
    newQuestionPage(); // loads new question
};

// Timer function
var keepTime = function() {

    timeCounter = 75; // starting time
    timerEl.textContent = timeCounter; // display time

    var countDown = setInterval(function() { // timer

        timeCounter--; // countdown
        timerEl.textContent = timeCounter; // display countdown

        if (timeCounter <= 0) { // IF time reaches 0 or below

            clearInterval(countDown); // stop counter
            timeCounter = 0; // if counter is below 0, set to 0
            timeKeeperEl.textContent = timeCounter; // refresh time display
            endGamePage(); // end game

        } else if (document.querySelector("form") || document.querySelector(".hs-container")) { //if game ends
            clearInterval(countDown); // stop counter
            timeCounter++
            timerEl.textContent = timeCounter; // display ending time
        }
    }, 1000);
}

// HTML DOM question page (loop: newQuestionPage, checkAnswer, checkQuestionCounter, newQuestionPage)
var newQuestionPage = function() {
    contentHolderEl.innerHTML = "";

    var i = questionCounter;

    var questionEL = createEl(questionEL, "div", contentHolderEl, "bold-text", "", questionArray[i].question);

    var btnHolderEl = createEl(btnHolderEl, "div", contentHolderEl, "answer-btn-container", "");

    for (var x = 0; x < questionArray[i].answerOptions.length; x++) {

        var answerBtnEl = createEl(answerBtnEl, "button", btnHolderEl, "btn", questionArray[i].answerOptions[x]);
    }

    btnHolderEl.addEventListener("click", checkAnswer);
};

// Checks to see if answer is right or wrong
var checkAnswer = function(event) {
    var i = questionCounter;

    if (!event.target.closest(".btn")) { // IF target is not a button
        return; // return and don't do anything

    } else if (event.target.closest(".btn") && // IF target is a button
        event.target.textContent === questionArray[i].correctAnswer) { // AND it is the correct answer

        checkQuestionCounter(); // load new question or end game

        var correctEl = createEl(correctEl, "div", contentHolderEl, "answer-text", "Correct!") // and append "Correct!"

    } else { // IF target is not the correct answer

        timeCounter = timeCounter - 10; // 10 second penalty
        timerEl.textContent = timeCounter;

        checkQuestionCounter(); // load new question or end game

        var wrongEl = createEl(wrongEl, "div", contentHolderEl, "answer-text", "Wrong!") // and append "Wrong!"
    };
}

// Checks to see if there are more questions to be loaded
var checkQuestionCounter = function() {
    questionCounter++; // count up questionCounter
    if (questionCounter < questionArray.length) { // IF there are more questions
        newQuestionPage(); // load new question
    } else {
        endGamePage(); // end game
    }
}

// HTML DOM end game page
var endGamePage = function() {
    contentHolderEl.innerHTML = ""

    var titleEl = createEl(titleEl, "div", contentHolderEl, "bold-text", "Coding Quiz Challenge");

    var scoreTextEl = createEl(scoreTextEl, "div", contentHolderEl, "hs-text", "Your final score is " + timeCounter + ".");

    var initialTextEl = createEl(initialTextEl, "div", contentHolderEl, "hs-text", "Enter initials: ");

    var initialFormEl = createEl(initialFormEl, "form", initialTextEl, "hs-form", "");

    var inputTextEl = createEl(inputTextEl, "input", initialFormEl, "", "", "", "", "text", "task-name");

    var inputSubmitEl = createEl(inputSubmitEl, "input", initialFormEl, "btn", "", "", "Submit", "submit");

    initialFormEl.addEventListener("submit", saveScore);
}

// Sorts and saves score into local storage as a JSON string
var saveScore = function(event) {
    event.preventDefault();

    var nameInput = document.querySelector("input[name='task-name']").value; // gets user input

    if (nameInput === "") { // user input must have a value
        return endGamePage();
    }

    var newScore = { // object to store the name and score of the user
        name: nameInput,
        score: timeCounter
    };

    var savedScores = localStorage.getItem("highscores"); // retrieves saved scores from local storage
    savedScores = JSON.parse(savedScores) || []; // converts JSON string to array, OR IF savedScores is undefined, sets value as an array
    savedScores.push(newScore); // push new score into the array

    savedScores.sort(function compareNumbers(a, b) { // sorts the array by highest score first
        return b.score - a.score;
    });

    localStorage.setItem("highscores", JSON.stringify(savedScores)); // saves the array to local storage

    highScoresPage(); // loads the high score page
}

// HTML DOM high score page
var highScoresPage = function() {
    contentHolderEl.innerHTML = "";
    contentHolderEl.removeAttribute("id");

    var scorePageTextEl = createEl(scorePageTextEl, "div", contentHolderEl, "bold-text", "High scores");

    var highScoreListEl = createEl(highScoreListEl, "div", contentHolderEl, "hs-container", "");

    var savedScores = localStorage.getItem("highscores"); // retrieve high scores from local storage
    savedScores = JSON.parse(savedScores) || "No high scores yet!"; // convert into an array, OR IF undefined, sets value to placeholder text

    if (!(savedScores === "No high scores yet!")) { // IF saved scores were not undefined
        for (var i = 0; i < savedScores.length; i++) { // retrieve each saved score object from the array

            var highScoreEl = createEl(highScoreEl, "div", highScoreListEl, "",
                (i + 1) + ". " + savedScores[i].name + " - " + savedScores[i].score); // and display it
        }
    } else { // ELSE saved scores were undefined

        var highScoreEl = createEl(highScoreEl, "div", highScoreListEl, "", savedScores); // display placeholder text
    }

    var buttonContainerEl = createEl(buttonContainerEl, "div", contentHolderEl, "endgame-btn-container", "");

    var backButtonEl = createEl(backButtonEl, "div", buttonContainerEl, "btn", "Go Back");

    var clearScoresButtonEl = createEl(clearScoresButtonEl, "div", buttonContainerEl, "btn", "Clear high scores");

    backButtonEl.addEventListener("click", startGamePage) // back button returns user to welcome page
    clearScoresButtonEl.addEventListener("click", clearScores) // clear scores button runs the clear scores function
}

// clears local storage
var clearScores = function() {
    localStorage.clear();
    highScoresPage();
}

startGamePage(); // brings user to the start game page on page load

highScoreLinkEl.addEventListener("click", highScoresPage); // View high scores button brings user to the high scores page