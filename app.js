// ==========================================
// CONFIGURATION PAR DÉFAUT
// ==========================================

let config = {

    questionCount: 20,

    timeLimit: 4,

    maxResult: 20,

    operations: ["+", "-"]

};


// ==========================================
// ÉTAT DE L'EXERCICE
// ==========================================

let currentQuestion = 0;

let score = 0;

let mistakes = [];

let currentCalculation = null;

let timerInterval = null;

let questionStartTime = 0;

let exerciseFinished = false;

let answerSubmitted = false;


// ==========================================
// MODE "REFAIRE LES ERREURS"
// ==========================================

let retryMode = false;

let retryQuestions = [];


// ==========================================
// ÉLÉMENTS HTML
// ==========================================

const homeScreen =
    document.getElementById("home-screen");

const settingsScreen =
    document.getElementById("settings-screen");

const exerciseScreen =
    document.getElementById("exercise-screen");

const resultScreen =
    document.getElementById("result-screen");


const startButton =
    document.getElementById("start-button");

const settingsButton =
    document.getElementById("settings-button");

const settingsStartButton =
    document.getElementById("settings-start-button");

const backButton =
    document.getElementById("back-button");


const questionCountInput =
    document.getElementById("question-count");

const timeLimitInput =
    document.getElementById("time-limit");

const maxResultInput =
    document.getElementById("max-result");


const answerInput =
    document.getElementById("answer");

const validateButton =
    document.getElementById("validate-button");


const currentQuestionDisplay =
    document.getElementById("current-question");

const totalQuestionsDisplay =
    document.getElementById("total-questions");

const calculationDisplay =
    document.getElementById("calculation");

const timerDisplay =
    document.getElementById("timer");

const feedbackDisplay =
    document.getElementById("feedback");


const scoreDisplay =
    document.getElementById("score");

const statisticsDisplay =
    document.getElementById("statistics");

const mistakesDisplay =
    document.getElementById("mistakes");


const restartButton =
    document.getElementById("restart-button");

const retryMistakesButton =
    document.getElementById("retry-mistakes-button");

const newExerciseButton =
    document.getElementById("new-exercise-button");

const modeClassic =
    document.getElementById(
        "mode-classic"
    );

const modeTables =
    document.getElementById(
        "mode-tables"
    );

const tablesSettings =
    document.getElementById(
        "tables-settings"
    );

const operationsSettings =
    document.getElementById(
        "operations-settings"
    );

const maxResultSetting =
    document.getElementById(
        "max-result-setting"
    );


// ==========================================
// AFFICHER UN ÉCRAN
// ==========================================

function showScreen(screenToShow) {

    const screens = [

        homeScreen,

        settingsScreen,

        exerciseScreen,

        resultScreen

    ];


    screens.forEach(screen => {

        screen.classList.add("hidden");

    });


    screenToShow.classList.remove("hidden");

}


// ==========================================
// LIRE LA CONFIGURATION
// ==========================================

function readConfiguration() {

    config.questionCount =
        Math.max(
            1,
            Number(questionCountInput.value) || 20
        );


    config.timeLimit =
        Math.max(
            0.5,
            Number(timeLimitInput.value) || 4
        );


    config.maxResult =
        Math.max(
            1,
            Number(maxResultInput.value) || 20
        );


    config.operations = [];


    if (
        document
            .getElementById("operation-addition")
            .checked
    ) {

        config.operations.push("+");

    }


    if (
        document
            .getElementById("operation-subtraction")
            .checked
    ) {

        config.operations.push("-");

    }


    if (
        document
            .getElementById("operation-multiplication")
            .checked
    ) {

        config.operations.push("*");

    }


    if (
        document
            .getElementById("operation-division")
            .checked
    ) {

        config.operations.push("/");

    }


    if (config.operations.length === 0) {

        alert(
            "Sélectionnez au moins une opération."
        );

        return false;

    }


    return true;

}


// ==========================================
// NOMBRE ALÉATOIRE
// ==========================================

function randomInteger(min, max) {

    return Math.floor(

        Math.random()
        *
        (max - min + 1)

    ) + min;

}

// =========================================
// GENERER DES TABLES
// =========================================
function generateTableCalculation() {

    const selectedTables =

        Array.from(
            document.querySelectorAll(
                ".table-checkbox:checked"
            )
        ).map(
            checkbox =>
                Number(
                    checkbox.value
                )
        );

    if (
        selectedTables.length === 0
    ) {

        return {

            a: 1,

            b: 1,

            operation: "*",

            answer: 1

        };

    }

    const table =

        selectedTables[
            Math.floor(
                Math.random()
                *
                selectedTables.length
            )
        ];

    const multiplier =

        Math.floor(
            Math.random() * 10
        ) + 1;

    return {

        a: table,

        b: multiplier,

        operation: "*",

        answer:
            table * multiplier

    };

}
// ==========================================
// GÉNÉRER UN CALCUL
// ==========================================

function generateCalculation() {


    // Si on refait les erreurs,
    // on reprend exactement les mêmes calculs.

    if (retryMode) {

        return retryQuestions[
            currentQuestion - 1
        ];

    }


    const operation =

        config.operations[
            randomInteger(
                0,
                config.operations.length - 1
            )
        ];


    let a;

    let b;

    let answer;


    do {


        a =
            randomInteger(
                1,
                config.maxResult
            );


        b =
            randomInteger(
                1,
                config.maxResult
            );


        // ------------------------------
        // ADDITION
        // ------------------------------

        if (operation === "+") {

            answer = a + b;

        }


        // ------------------------------
        // SOUSTRACTION
        // ------------------------------

        if (operation === "-") {

            if (b > a) {

                [a, b] = [b, a];

            }


            answer = a - b;

        }


        // ------------------------------
        // MULTIPLICATION
        // ------------------------------

        if (operation === "*") {

            answer = a * b;

        }


        // ------------------------------
        // DIVISION
        // ------------------------------

        if (operation === "/") {

            answer =
                randomInteger(
                    1,
                    config.maxResult
                );


            const divisor =
                randomInteger(
                    1,
                    config.maxResult
                );


            a =
                answer * divisor;


            b =
                divisor;

        }


    } while (

        answer < 0

        ||

        answer > config.maxResult

        ||

        !Number.isInteger(answer)

    );


    return {

        a: a,

        b: b,

        operation: operation,

        answer: answer

    };

}


// ==========================================
// AFFICHER LE CALCUL
// ==========================================

function displayCalculation() {

    answerSubmitted = false;


if (retryMode) {

    currentCalculation =
        retryQuestions[
            currentQuestion - 1
        ];

}
else if (modeTables.checked) {

    currentCalculation =
        generateTableCalculation();

}
else {

    currentCalculation =
        generateCalculation();

}

    const symbol =

        currentCalculation.operation

            .replace("*", "×")

            .replace("/", "÷");


    calculationDisplay.textContent =

        `${currentCalculation.a}
         ${symbol}
         ${currentCalculation.b}`;


    currentQuestionDisplay.textContent =
        currentQuestion;


    totalQuestionsDisplay.textContent =
        config.questionCount;


    answerInput.value = "";


    feedbackDisplay.textContent = "";

    feedbackDisplay.style.color = "";

    feedbackDisplay.style.background = "";


    answerInput.disabled = false;

    validateButton.disabled = false;

    //calculation.focus();
    answerInput.focus();

}


// ==========================================
// CHRONOMÈTRE
// ==========================================

function startTimer() {


    clearInterval(
        timerInterval
    );


    questionStartTime =
        performance.now();


    timerDisplay.textContent =

        config.timeLimit.toFixed(1);


    timerDisplay.style.color =
        "var(--primary)";


    timerInterval = setInterval(
        () => {


            const elapsed =

                (
                    performance.now()
                    -
                    questionStartTime
                ) / 1000;


            const remaining =

                config.timeLimit
                -
                elapsed;


            timerDisplay.textContent =

                Math.max(
                    0,
                    remaining
                ).toFixed(1);


            // Le chrono devient orange
            // lorsqu'il reste peu de temps.

            if (
                remaining <= 2
                &&
                remaining > 1
            ) {

                timerDisplay.style.color =
                    "#e6a700";

            }


            // Puis rouge.

            if (remaining <= 1) {

                timerDisplay.style.color =
                    "var(--error)";

            }


            if (remaining <= 0) {

                clearInterval(
                    timerInterval
                );


                handleTimeout();

            }


        },
        50
    );

}


// ==========================================
// VÉRIFICATION DE LA RÉPONSE
// ==========================================

function checkAnswer() {


    // L'exercice est terminé
    if (exerciseFinished) {

        return;

    }


    // Cette question a déjà été validée
    if (answerSubmitted) {

        return;

    }


    // On verrouille immédiatement la question.
    // Cela évite les doubles validations.
    answerSubmitted = true;


    // On arrête le chrono.
    clearInterval(timerInterval);


    const answerText =
        answerInput.value.trim();


    const userAnswer =
        Number(answerText);


    const correctAnswer =
        currentCalculation.answer;


    // ======================================
    // RIEN N'A ÉTÉ ENTRÉ
    // ======================================

    if (answerText === "") {


        mistakes.push({

            calculation:
                currentCalculation,

            userAnswer: null,

            timeout: true

        });


        showTimeoutFeedback();


        return;

    }


    // ======================================
    // BONNE RÉPONSE
    // ======================================

    if (
        userAnswer === correctAnswer
    ) {


        score++;


        showFeedback(true);


        return;

    }


    // ======================================
    // MAUVAISE RÉPONSE
    // ======================================

    mistakes.push({

        calculation:
            currentCalculation,

        userAnswer:
            userAnswer,

        timeout: false

    });


    showFeedback(false);

}

// ==========================================
// FEEDBACK
// ==========================================

function showFeedback(correct) {


    answerInput.disabled = true;

    validateButton.disabled = true;


    if (correct) {


        feedbackDisplay.textContent =
            "✓ CORRECT";


        feedbackDisplay.style.color =
            "var(--success)";


        feedbackDisplay.style.background =
            "var(--success-background)";


    }

    else {


        feedbackDisplay.textContent =

            `✕ FAUX — ${currentCalculation.answer}`;


        feedbackDisplay.style.color =
            "var(--error)";


        feedbackDisplay.style.background =
            "var(--error-background)";

    }


    setTimeout(
        () => {

            nextQuestion();

        },
        600
    );

}

// ==========================================
// FEEDBACK TIMEOUT
// ==========================================
function showTimeoutFeedback() {


    answerInput.disabled = true;

    validateButton.disabled = true;


    feedbackDisplay.textContent =

        `⏱ TEMPS DÉPASSÉ — ${currentCalculation.answer}`;


    feedbackDisplay.style.color =
        "var(--error)";


    feedbackDisplay.style.background =
        "var(--error-background)";


    setTimeout(
        () => {

            nextQuestion();

        },
        600
    );

}


// ==========================================
// TEMPS DÉPASSÉ
// ==========================================

function handleTimeout() {


    if (exerciseFinished) {

        return;

    }


    // On utilise exactement le même
    // système que le bouton Valider.
    checkAnswer();

}

// ==========================================
// QUESTION SUIVANTE
// ==========================================

function nextQuestion() {


    if (exerciseFinished) {

        return;

    }


    currentQuestion++;


    if (

        currentQuestion
        >
        config.questionCount

    ) {


        showResults();


        return;

    }


    displayCalculation();


    startTimer();

}


// ==========================================
// DÉMARRER UN EXERCICE
// ==========================================

function startExercise() {


    clearInterval(
        timerInterval
    );


    currentQuestion = 0;

    score = 0;

    mistakes = [];

    exerciseFinished = false;


    showScreen(
        exerciseScreen
    );


    nextQuestion();

}


// ==========================================
// AFFICHER LES RÉSULTATS
// ==========================================

function showResults() {


    exerciseFinished = true;


    clearInterval(
        timerInterval
    );


    showScreen(
        resultScreen
    );


    scoreDisplay.textContent =

        `${score} / ${config.questionCount}`;


    const errors =

        mistakes.filter(
            mistake =>
                !mistake.timeout
        ).length;


    const timeouts =

        mistakes.filter(
            mistake =>
                mistake.timeout
        ).length;


    statisticsDisplay.innerHTML = `

        ✓ ${score} correct(s)

        <br>

        ✕ ${errors} erreur(s)

        <br>

        ⏱ ${timeouts} temps dépassé(s)

    `;


    displayMistakes();


    // S'il n'y a aucune erreur,
    // le bouton "Refaire les erreurs"
    // disparaît.

    if (mistakes.length === 0) {

        retryMistakesButton.style.display =
            "none";

    }

    else {

        retryMistakesButton.style.display =
            "block";

    }

}


// ==========================================
// AFFICHER LES ERREURS
// ==========================================

function displayMistakes() {


    if (mistakes.length === 0) {


        mistakesDisplay.innerHTML =

            "<strong>🎉 Bravo ! Aucune erreur.</strong>";


        return;

    }


    let html =
        "<h3>À revoir</h3>";


    mistakes.forEach(
        mistake => {


            const c =
                mistake.calculation;


            const symbol =

                c.operation

                    .replace("*", "×")

                    .replace("/", "÷");


            html += `

                <div>

                    <strong>

                        ${c.a}
                        ${symbol}
                        ${c.b}
                        =
                        ${c.answer}

                    </strong>


                    ${
                        mistake.timeout

                        ?

                        " — Temps dépassé"

                        :

                        ` — Votre réponse :
                        ${mistake.userAnswer}`

                    }

                </div>

            `;

        }
    );


    mistakesDisplay.innerHTML =
        html;

}


// ==========================================
// REFAIRE LES ERREURS
// ==========================================

function retryMistakes() {


    if (mistakes.length === 0) {

        return;

    }


    // On sauvegarde exactement
    // les calculs qui ont été ratés.

    retryQuestions = mistakes.map(
        mistake =>
            mistake.calculation
    );


    // Activation du mode erreurs.

    retryMode = true;


    // Le nombre de questions
    // devient le nombre d'erreurs.

    config.questionCount =
        retryQuestions.length;


    startExercise();

}


// ==========================================
// BOUTON COMMENCER
// ==========================================

startButton.addEventListener(
    "click",
    () => {


        if (
            readConfiguration()
        ) {

            retryMode = false;

            startExercise();

        }

    }
);


// ==========================================
// COMMENCER DEPUIS CONFIGURATION
// ==========================================

settingsStartButton.addEventListener(
    "click",
    () => {


        if (
            readConfiguration()
        ) {

            retryMode = false;

            startExercise();

        }

    }
);


// ==========================================
// OUVRIR CONFIGURATION
// ==========================================

settingsButton.addEventListener(
    "click",
    () => {

        showScreen(
            settingsScreen
        );

    }
);


// ==========================================
// RETOUR ACCUEIL
// ==========================================

backButton.addEventListener(
    "click",
    () => {

        showScreen(
            homeScreen
        );

    }
);


// ==========================================
// VALIDER
// ==========================================

validateButton.addEventListener(
    "click",
    checkAnswer
);


// ==========================================
// TOUCHE ENTRÉE
// ==========================================

answerInput.addEventListener(
    "keydown",
    event => {


        if (
            event.key === "Enter"
        ) {

            checkAnswer();

        }

    }
);


// ==========================================
// RECOMMENCER L'EXERCICE
// ==========================================

restartButton.addEventListener(
    "click",
    () => {


        // Très important :
        // on quitte le mode "erreurs".

        retryMode = false;


        // On remet le nombre
        // configuré initialement.

        config.questionCount =

            Number(
                questionCountInput.value
            );


        startExercise();

    }
);


// ==========================================
// REFAIRE LES ERREURS
// ==========================================

retryMistakesButton.addEventListener(
    "click",
    retryMistakes
);


// ==========================================
// MODIFIER LA CONFIGURATION
// ==========================================

newExerciseButton.addEventListener(
    "click",
    () => {


        retryMode = false;


        showScreen(
            settingsScreen
        );

    }
);

// =====================
// INSTALLATION PWA
// =====================

let deferredPrompt;

const installButton =
    document.getElementById(
        "installButton"
    );

window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();

        deferredPrompt = event;

        installButton.hidden = false;

    }
);

installButton.addEventListener(
    "click",
    async () => {

        if (!deferredPrompt) {

            return;

        }

        deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        deferredPrompt = null;

        installButton.hidden = true;

    }
);

modeClassic.addEventListener(
    "change",
    () => {

        tablesSettings.classList.add(
            "hidden"
        );

        operationsSettings.classList.remove(
            "hidden"
        );

        maxResultSetting.classList.remove(
            "hidden"
        );

    }
);

modeTables.addEventListener(
    "change",
    () => {

        tablesSettings.classList.remove(
            "hidden"
        );

        operationsSettings.classList.add(
            "hidden"
        );

        maxResultSetting.classList.add(
            "hidden"
        );

    }
);
// ==========================================
// INITIALISATION
// ==========================================
console.log("modeClassic =", modeClassic);
console.log("modeTables =", modeTables);
console.log("tablesSettings =", tablesSettings);

showScreen(
    homeScreen
);