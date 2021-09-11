//global variables
var score; //logs the user score
var quesIndex;

var start = document.getElementById(`start`);
start.addEventListener("click", startQuiz);
var save = document.getElementById("save");
save.addEventListener("click", saveScore);
var saveForm = document.getElementById("save-form");
var viewScoresBtn = document.getElementById("scores");
viewScoresBtn.addEventListener("click", viewScores);
var quizCont = document.getElementById("quiz-container");
var questionEl = document.getElementById("question");
// console.log(questionEl);
var answerBtnsEl = document.getElementById("answers");
// console.log("ansBtnsEl: " + answerBtnsEl);
// console.log("first child" + answerBtnsEl.firstChild);
var resultEl = document.getElementById("result");
// console.log(resultEl);
var timerEl = document.getElementById("timer");
var secondsLeft;
var timer;

function startQuiz() {
  clearInterval(timer);
  hideSaveForm();
  secondsLeft = 99;
  quesIndex = 0;
  resetResult();
  console.log("started");
  //change start button to quit or new game
  start.textContent = `New Game`;
  quizCont.classList.remove("remove");
  setQuestion();
  showTime();
  startTimer();
}

function resetResult() {
  resultEl.classList.add("remove");
  resultEl.classList.remove("correct");
  resultEl.classList.remove("wrong");
  resultEl.textContent = "";
}

function setQuestion() {
  resetQuizCont();
  //   console.log(questions[quesIndex]);
  displayQues(questions[quesIndex]);
}

function displayQues(question) {
  //   console.log(question.answers);
  questionEl.textContent = question.question;
  question.answers.forEach((answer) => {
    var button = document.createElement("button");
    button.textContent = answer.text;
    // console.log("answer: " + answer.text);
    button.classList.add("btn", "answer");
    if (answer.correct) {
      button.setAttribute("id", "correct");
    }
    button.addEventListener("click", chooseAns);
    answerBtnsEl.appendChild(button);
  });
}

function resetQuizCont() {
    questionEl.textContent = "";
  while (answerBtnsEl.firstChild) {
    answerBtnsEl.removeChild(answerBtnsEl.firstChild);
  }
}

function chooseAns(e) {
  var userAns = e.target;
  var correctAns = document.getElementById("correct");
  resultEl.classList.remove("remove");
  resetResult();
  if (userAns === correctAns) {
    resultEl.textContent = "Correct!";
    resultEl.classList.add("correct");
    // console.log(`correct`);
    // console.log(`score: ${secondsLeft}`);
  } else {
    resultEl.textContent = "Wrong";
    resultEl.classList.add("wrong");
    // console.log(`wrong`);
    if (secondsLeft > 10) {
      secondsLeft = secondsLeft - 10;
    } else {
      secondsLeft = 0;
    }
    // console.log(`score: ${secondsLeft}`);
  }
  if (quesIndex < questions.length - 1) {
    quesIndex++;
    setQuestion();
  } else {
    clearInterval(timer);
    timerEl.textContent = `Timer: ${secondsLeft}`;
    resetQuizCont();
    showScore();
    showSaveForm();
    // console.log('score: ' +secondsLeft);
  }
}

function showScore() {
  questionEl.textContent = `Your Score:`;
  answerBtnsEl.textContent = `${secondsLeft}`;
  answerBtnsEl.classList.add("score");
}

function startTimer() {
  timerEl.textContent = `Timer: 100`;
  timer = setInterval((displayTime) => {
    // console.log(`timer: ${secondsLeft}`);
    timerEl.textContent = `Timer: ${secondsLeft}`;
    setTime();
    if (secondsLeft < 0) {
      clearInterval(timer);
    }
  }, 1000);
  return timer;
}
function getTime() {
  return secondsLeft;
}
function setTime() {
  return secondsLeft--;
}
function showTime() {
  timerEl.classList.remove("remove");
}
function showSaveForm() {
  console.log("save");
  save.classList.remove("remove");
  saveForm.classList.remove("remove");
}
function hideSaveForm() {
  save.classList.add("remove");
  saveForm.classList.add("remove");
}
function saveScore() {
  var initials = saveForm.value;
//   console.log(initials);
  if (!localStorage.getItem(`${initials}`)) {
    localStorage.setItem(`${initials} index`, 1);
    localStorage.setItem(initials, secondsLeft);
  } else {
    if (!localStorage.getItem(`${initials} index`)) {
        localStorage.setItem(`${initials} index`, 2);
        localStorage.setItem(`${initials} 2`, `${secondsLeft}`);
    }
    else {
        var userIdx = localStorage.getItem(`${initials} index`);
        // console.log(userIdx);
        userIdx++;
        localStorage.setItem(`${initials} index`, userIdx);
        // console.log(userIdx);
        var scoreName = `${initials} ${userIdx}`;
        localStorage.setItem(`${scoreName}`, `${secondsLeft}`);  
    }
  }

  hideSaveForm();
}
function viewScores() {
    clearInterval(timer);
    resetQuizCont();
    resetResult();
    quizCont.classList.remove("remove");  
    questionEl.textContent = "High Scores";
//   console.log(storage);
//   console.log(localStorage);
  getScores();
}
function getScores() {
    var keyName = Object.keys(localStorage);
    var keyValue =Object.values(localStorage);
    var scores = [];
    var sortedScores = [];
    // console.log(keyName)
    // console.log(keyName[0])
    for (let i = 0; i < keyName.length; i++) {
        if (!keyName[i].endsWith('index')) {
            // console.log(keyName[i]);
            // console.log(keyValue[i]);
            scores.push({inits:keyName[i], score:keyValue[i]}) 
        }
    }
    // console.log(scores)
    // console.log(scores[0].score)
    sortedScores = scores.sort((a, b) => b.score - a.score);
    // console.log(sortedScores);
    // console.log(sortedScores[0].inits)
    for (let i = 0; i < sortedScores.length; i++) {
        displayScores(sortedScores[i].inits, sortedScores[i].score);  
    }
}
function displayScores(keyName, keyValue) {
    var element = document.createElement("div");
        element.textContent = `${keyName}: ${keyValue}`;
        answerBtnsEl.appendChild(element);
}
var questions = [
  {
    question:
      "What is the scope of a variable declared outside of a function in Javascript?",
    answers: [
      { text: "a: mint scope", correct: false },
      { text: "b: global scope", correct: true },
      { text: "c: function scope", correct: false },
      { text: "d: block scope", correct: false },
    ],
    //   correctAnswer: "b",
  },
  {
    question:
      "In this example, what is firstName?: name(firstName) {let myName = firstName; return myName;}",
    answers: [
      { text: "a: an argument", correct: false },
      { text: "b: John", correct: false },
      { text: "c: name", correct: false },
      { text: "d: a parameter", correct: true },
    ],
    //   correctAnswer: "d",
  },
  {
    question: "In this example, what is inside the parenthesis?: name(John);",
    answers: [
      { text: "a: an argument", correct: true },
      { text: "b: Billy", correct: false },
      { text: "c: name", correct: false },
      { text: "d: a parameter", correct: false },
    ],
    //   correctAnswer: "a",
  },
  {
    question:
      "In this example, what does the '++' do?: let count = 0; count ++;",
    answers: [
      { text: "a: add two to the current value of count", correct: false },
      { text: "b: adds '++' as a string to count", correct: false },
      { text: "c: add one to the current value of count", correct: true },
      { text: "d: doubles the current value of count", correct: false },
    ],
    //   correctAnswer: "c",
  },
  {
    question: "What does this expression return?: let x = 6 % 4",
    answers: [
      { text: "a: undefined", correct: false },
      { text: "b: 2", correct: true },
      { text: "c: 1.5", correct: false },
      { text: "d: 0", correct: false },
    ],
    //   correctAnswer: "b",
  },
];