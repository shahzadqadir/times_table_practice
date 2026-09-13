/* =====================================================
   SAVED DATA
===================================================== */

const STORAGE_KEY = "timesTablesTrainer";


function getDefaultData() {

    const tables = {};

    for (let i = 1; i <= 12; i++) {

        tables[i] = {
            correct: 0,
            attempts: 0
        };

    }

    return {

        totalQuestions: 0,
        totalCorrect: 0,

        bestScore: 0,

        longestStreak: 0,

        sessions: 0,

        lastTables: [],

        tables: tables
    };
}


let savedData =
    JSON.parse(localStorage.getItem(STORAGE_KEY))
    || getDefaultData();


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedData)
    );

}


/* =====================================================
   GAME VARIABLES
===================================================== */

const TOTAL_QUESTIONS = 10;

let selectedTables = [];

let currentQuestion = 0;

let correctAnswers = 0;

let wrongAnswers = 0;

let streak = 0;

let sessionBestStreak = 0;

let number1;

let number2;

let correctAnswer;


/* =====================================================
   CREATE TABLE BUTTONS
===================================================== */

const tablesContainer =
    document.getElementById("tables");


for (let i = 1; i <= 12; i++) {

    const button =
        document.createElement("button");

    button.className =
        "table-button";

    button.textContent = i;

    button.dataset.table = i;

    button.onclick = function () {

        toggleTable(i, button);

    };

    tablesContainer.appendChild(button);

}


/* =====================================================
   LOAD LAST SELECTION
===================================================== */

function loadLastSelection() {

    if (
        savedData.lastTables &&
        savedData.lastTables.length > 0
    ) {

        selectedTables =
            [...savedData.lastTables];

    } else {

        selectedTables = [2, 5, 10];

    }


    document
        .querySelectorAll(".table-button")
        .forEach(button => {

            const table =
                Number(button.dataset.table);

            if (selectedTables.includes(table)) {

                button.classList.add("selected");

            }

        });

}


loadLastSelection();


/* =====================================================
   TABLE SELECTION
===================================================== */

function toggleTable(table, button) {

    if (selectedTables.includes(table)) {

        selectedTables =
            selectedTables.filter(
                value => value !== table
            );

        button.classList.remove("selected");

    } else {

        selectedTables.push(table);

        button.classList.add("selected");

    }

}


function selectAll() {

    selectedTables = [];

    for (let i = 1; i <= 12; i++) {

        selectedTables.push(i);

    }

    document
        .querySelectorAll(".table-button")
        .forEach(button => {

            button.classList.add("selected");

        });

}


function clearTables() {

    selectedTables = [];

    document
        .querySelectorAll(".table-button")
        .forEach(button => {

            button.classList.remove("selected");

        });

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    if (selectedTables.length === 0) {

        alert(
            "Choose at least one times table first 🙂"
        );

        return;
    }


    savedData.lastTables =
        [...selectedTables];

    savedData.sessions++;

    saveData();


    currentQuestion = 0;

    correctAnswers = 0;

    wrongAnswers = 0;

    streak = 0;

    sessionBestStreak = 0;


    document.getElementById("setup")
        .style.display = "none";

    document.getElementById("game")
        .style.display = "block";


    updateScore();

    nextQuestion();

}


/* =====================================================
   GENERATE QUESTION
===================================================== */

function nextQuestion() {

    if (currentQuestion >= TOTAL_QUESTIONS) {

        showResults();

        return;
    }


    currentQuestion++;


    const table =
        selectedTables[
            Math.floor(
                Math.random() *
                selectedTables.length
            )
        ];


    number1 = table;


    number2 =
        Math.floor(
            Math.random() * 12
        ) + 1;


    correctAnswer =
        number1 * number2;


    document.getElementById("question")
        .textContent =
        `${number1} × ${number2}`;


    document.getElementById("questionNumber")
        .textContent =
        `Question ${currentQuestion} of ${TOTAL_QUESTIONS}`;


    document.getElementById("progress")
        .style.width =
        `${((currentQuestion - 1) /
            TOTAL_QUESTIONS) * 100}%`;


    const input =
        document.getElementById("answer");


    input.value = "";

    input.disabled = false;

    input.focus();


    document.getElementById("feedback")
        .textContent = "";


    document.getElementById("nextButton")
        .style.display = "none";


    document.getElementById("submitButton")
        .style.display = "block";

}


/* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer() {

    const input =
        document.getElementById("answer");


    const answer =
        Number(input.value);


    const feedback =
        document.getElementById("feedback");


    if (input.value === "") {

        feedback.textContent =
            "🤔 Have a guess! You can do it.";

        feedback.className =
            "feedback wrong";

        return;

    }


    input.disabled = true;


    document.getElementById("submitButton")
        .style.display = "none";


    /* Update table statistics */

    savedData.tables[number1].attempts++;


    if (answer === correctAnswer) {

        correctAnswers++;

        streak++;

        savedData.totalQuestions++;

        savedData.totalCorrect++;

        savedData.tables[number1].correct++;


        if (streak > sessionBestStreak) {

            sessionBestStreak = streak;

        }


        if (
            sessionBestStreak >
            savedData.longestStreak
        ) {

            savedData.longestStreak =
                sessionBestStreak;

        }


        let message;


        if (streak >= 5) {

            message =
                "🔥 AMAZING! You're on fire!";

        } else if (streak >= 3) {

            message =
                "🌟 Brilliant! Keep going!";

        } else {

            message =
                "🎉 Fantastic! That's correct!";

        }


        feedback.textContent = message;

        feedback.className =
            "feedback correct";


    } else {

        wrongAnswers++;

        streak = 0;

        savedData.totalQuestions++;


        feedback.innerHTML =
            `👍 Good try! The answer is
             <strong>${correctAnswer}</strong>.`;

        feedback.className =
            "feedback wrong";

    }


    saveData();

    updateScore();


    document.getElementById("nextButton")
        .style.display = "block";


    document.getElementById("progress")
        .style.width =
        `${(currentQuestion /
            TOTAL_QUESTIONS) * 100}%`;

}


/* =====================================================
   UPDATE CURRENT SCORE
===================================================== */

function updateScore() {

    document.getElementById("score")
        .textContent =
        correctAnswers;

    document.getElementById("correct")
        .textContent =
        correctAnswers;

    document.getElementById("wrong")
        .textContent =
        wrongAnswers;

    document.getElementById("streak")
        .textContent =
        streak;

}


/* =====================================================
   SHOW RESULTS
===================================================== */

function showResults() {

    document.getElementById("game")
        .style.display = "none";

    document.getElementById("results")
        .style.display = "block";


    const score =
        correctAnswers;


    document.getElementById("finalScore")
        .textContent =
        `${score} / ${TOTAL_QUESTIONS}`;


    let emoji;

    let message;


    if (score === 10) {

        emoji = "🏆";

        message =
            "PERFECT SCORE! You are a times-tables superstar! 🌟";

    } else if (score >= 8) {

        emoji = "🌟";

        message =
            "Excellent work! You're getting really good at this!";

    } else if (score >= 6) {

        emoji = "👏";

        message =
            "Great effort! Keep practising and you'll get even better!";

    } else {

        emoji = "💪";

        message =
            "Good effort! Every practice round makes you stronger!";

    }


    document.getElementById("resultsEmoji")
        .textContent = emoji;


    document.getElementById("finalMessage")
        .textContent = message;


    /* Personal best */

    const newBest =
        document.getElementById("newBest");


    if (score > savedData.bestScore) {

        savedData.bestScore = score;

        saveData();

        newBest.style.display = "block";

    } else {

        newBest.style.display = "none";

    }


    updateDashboard();

}


/* =====================================================
   RESTART
===================================================== */

function restartGame() {

    document.getElementById("results")
        .style.display = "none";

    document.getElementById("setup")
        .style.display = "block";


    updateDashboard();

    updateTableProgress();

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    document.getElementById("totalQuestions")
        .textContent =
        savedData.totalQuestions;


    let accuracy = 0;


    if (savedData.totalQuestions > 0) {

        accuracy =
            Math.round(
                (savedData.totalCorrect /
                 savedData.totalQuestions) * 100
            );

    }


    document.getElementById("accuracy")
        .textContent =
        `${accuracy}%`;


    document.getElementById("bestScore")
        .textContent =
        `${savedData.bestScore}/10`;


    document.getElementById("bestStreak")
        .textContent =
        `${savedData.longestStreak} 🔥`;

}


updateDashboard();


/* =====================================================
   TABLE PROGRESS
===================================================== */

function updateTableProgress() {

    const container =
        document.getElementById("tableProgress");


    container.innerHTML = "";


    for (let i = 1; i <= 12; i++) {

        const data =
            savedData.tables[i];


        const percentage =
            data.attempts === 0
                ? 0
                : Math.round(
                    (data.correct /
                     data.attempts) * 100
                );


        const row =
            document.createElement("div");


        row.className =
            "table-progress";


        row.innerHTML = `

            <div class="table-progress-header">

                <span>
                    ${i} times table
                </span>

                <span>
                    ${
                        data.attempts === 0
                        ? "Not practised yet"
                        : `${percentage}%`
                    }
                </span>

            </div>

            <div class="bar-container">

                <div
                    class="bar"
                    style="width:${percentage}%">
                </div>

            </div>
        `;


        container.appendChild(row);

    }

}


updateTableProgress();


/* =====================================================
   RESET PROGRESS
===================================================== */

function resetProgress() {

    const confirmed =
        confirm(
            "Are you sure you want to erase all progress?"
        );


    if (!confirmed) {

        return;

    }


    savedData =
        getDefaultData();


    saveData();


    selectedTables = [2, 5, 10];


    document
        .querySelectorAll(".table-button")
        .forEach(button => {

            const table =
                Number(button.dataset.table);

            if (
                selectedTables.includes(table)
            ) {

                button.classList.add("selected");

            } else {

                button.classList.remove("selected");

            }

        });


    updateDashboard();

    updateTableProgress();

}


/* =====================================================
   ENTER KEY SUPPORT
===================================================== */

document
    .getElementById("answer")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Enter") {

                return;

            }


            const submit =
                document.getElementById(
                    "submitButton"
                );


            const next =
                document.getElementById(
                    "nextButton"
                );


            if (
                submit.style.display !== "none"
            ) {

                checkAnswer();

            } else if (
                next.style.display !== "none"
            ) {

                nextQuestion();

            }

        }
    );
