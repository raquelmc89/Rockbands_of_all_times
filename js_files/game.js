const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

fetch(
    '../questions.json'
)//fetch the file and returns a promise that resolves with response object
    .then((res) => {
        return res.json();
    })/*represent the entire HTTP response.
    to extract body content I use second response*/
    .then((loadedQuestions) => {

            questions = loadedQuestions.results.map(
                (resultQuestion) => {
                const formattedQuestion = {question: resultQuestion.question, answer: Math.floor(Math.random() * 4) + 1 };
                
                const answerChoices = [...resultQuestion.wrongAnswers];
                answerChoices.splice(
                    formattedQuestion.answer - 1,
                    0,
                    resultQuestion.answer
                );
        
                answerChoices.forEach((choice, index) => {
                    formattedQuestion['choice' + (index + 1)] = choice;
                });
    
                return formattedQuestion;
            });
    
            console.log("questions", questions);
            
            startGame();
        })
        .catch((err) => {
            console.error(err);
        });
 //if it doesnt work then an error will appear in the console
//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;


// function definition
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions]; //get all the questions.
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('../html_files/end.html');
    }
    /*if the questions is 0 or get to maximum, the most recent score will be storaged locally.
     when questions finish then it will appear end.html*/
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;//show questions in page

    choices.forEach((choice) => {
        const number = choice.dataset['number'];//gets a letter of each choice. gets the data from html (data-number = 1)
        choice.innerText = currentQuestion['choice' + number];//show the questions with their answers.
    });

    availableQuesions.splice(questionIndex, 1);//??
    acceptingAnswers = true;
};
// function to get the right answer
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
}
