//Pour savoir quoi faire apres la validation d'une reponse
function UpdateGameScreen() {
    if (questionCourante != nbQuestion) {
        questionCourante++;
        document.getElementById('QuestionCourante').textContent = 'Question courante : ' + questionCourante + '/' + nbQuestion;
        afficherUnCalcul();
    }
    else {
        endgameScreen();
        document.getElementById('QuestionCourante').style.display = 'none'
        if (nbDeBonneReponses > 1) {
            document.getElementById('MessageDebutFin').textContent = 'Vous avez eu ' + nbDeBonneReponses + ' bonnes réponses sur ' + nbQuestion + ' : ' + (nbDeBonneReponses / nbQuestion * 100).toFixed(2) + '%';
        }
        else {
            document.getElementById('MessageDebutFin').textContent = 'Vous avez eu ' + nbDeBonneReponses + ' bonne réponse sur ' + nbQuestion + ' : ' + (nbDeBonneReponses / nbQuestion * 100).toFixed(2) + '%';
        }
    }
}

//Methode specifique a la page quand on commence le jeu
let nbQuestion;
let questionCourante;
function ajoutsSpecifiques() {
    document.getElementById('QuestionCourante').style.display = 'inline';
    questionCourante = 1;
    nbQuestion = document.getElementById('nombreQuestion').value;
    document.getElementById('QuestionCourante').textContent = 'Question courante : ' + questionCourante + '/' + nbQuestion;
}