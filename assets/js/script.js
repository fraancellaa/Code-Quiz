// variables defined 

var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");

var currentQuestionIndex = 0;
var time = questions.length * 10;
var timerId;

function startQuiz() {
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  questionsEl.removeAttribute("class");

  // timer starts
  timerId = setInterval(clockTick, 1000);

  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {

  var currentQuestion = questions[currentQuestionIndex];

  // questions start
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  choicesEl.innerHTML = "";

  // question choices looping 
  currentQuestion.choices.forEach(function(choice, i) {
    // new button for each question
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // click event listeners for each question click
    choiceNode.onclick = questionClick;

    // show on page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  // wrong answer
  if (this.value !== questions[currentQuestionIndex].answer) {
    // subtract time
    time -= 10;

    if (time < 0) {
      time = 0;
    }
    // show new time
    timerEl.textContent = time;
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.fontSize = "200%";
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.fontSize = "400%";
  }

  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // next question
  currentQuestionIndex++;

  // timer
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show finish screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // final score displayed
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // time updated
  time--;
  timerEl.textContent = time;

  // running out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    
    var newScore = {
      score: time,
      initials: initials
    };

    // saving to local storage

    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // other page displaying
    window.location.href = "score.html";
  }
}

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// initials
submitBtn.onclick = saveHighscore;

// start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;