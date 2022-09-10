
const highScore = document.getElementById('highScore');
const username = document.getElementById('username') ;

// check the database to see the most recent score of this user
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];



highScore.innerText = highScores[0].score ; 
username.innerText = highScores[0].name ;