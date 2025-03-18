//afficher text onload et music onLoad
window.addEventListener('load', onPageLoad);
function onPageLoad() {
    if (window.innerWidth >= 768) {
        document.getElementById('MessageDebutFin').textContent = 'Cliquer "Commencer" pour démarrer une partie';
    }
    else {
        document.getElementById('MessageDebutFin').innerHTML = 'Cliquer "<i class="fa-solid fa-play"></i>" pour démarrer une partie';
    }
    this.document.getElementById('back_music').play();
}

window.addEventListener('click', function () {
    if (testEstCommence == false) {
        this.document.getElementById('back_music').play();
    }
});

//list des configurations selon les difficulte et fonction pour retourner la config selon la difficulte
const configurationDifficulte = {
    facile: {
        min: 0,
        max: 12,
        operationLogic: {
            '-': (min, max) => {
                const num2 = getRandomInteger(min, max);
                const num1 = getRandomInteger(num2, max);
                return { num1, num2 };
            },
            '÷': (min, max) => {
                const num2 = getRandomInteger(1, max);
                const num1 = getRandomInteger(min, max) * num2;
                return { num1, num2 };
            },
            'default': (min, max) => {
                const num1 = getRandomInteger(min, max);
                const num2 = getRandomInteger(min, max);
                return { num1, num2 };
            }
        }
    },
    moyen: {
        min: -12,
        max: 12,
        operationLogic: {
            '÷': (min, max) => {
                const num2 = getRandomInteger(1, max);
                const num1 = getRandomInteger(min, max) * num2;
                return { num1, num2 };
            },
            'default': (min, max) => {
                const num1 = getRandomInteger(min, max);
                const num2 = getRandomInteger(min, max);
                return { num1, num2 };
            }
        }
    },
    difficile: {
        min: -16,
        max: 16,
        operationLogic: {
            '÷': (min, max) => {
                const num2 = getRandomInteger(1, max);
                const num1 = getRandomInteger(min, max) * num2;
                return { num1, num2 };
            },
            'default': (min, max) => {
                const num1 = getRandomInteger(min, max);
                const num2 = getRandomInteger(min, max);
                return { num1, num2 };
            }
        }
    }
};

function getConfiguration(pDifficulte) {
    return configurationDifficulte[pDifficulte];
}

//fonction random
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//code pour le choix des operations
let operations = [];
function choixOperations() {
    operations = [];
    if (document.getElementById('add').checked) operations.push('+');
    if (document.getElementById('sub').checked) operations.push('-');
    if (document.getElementById('mul').checked) operations.push('x');
    if (document.getElementById('divi').checked) operations.push('÷');
    return operations;
}

//Code pour ecrire l'expression mathematique
let num1;
let num2;
let operation;
let configurationPourCalcul;
function afficherUnCalcul() {
    operation = operations[Math.floor(Math.random() * operations.length)];

    if (configurationPourCalcul.operationLogic[operation]) {
        ({ num1, num2 } = configurationPourCalcul.operationLogic[operation](configurationPourCalcul.min, configurationPourCalcul.max));
    }
    else {
        ({ num1, num2 } = configurationPourCalcul.operationLogic['default'](configurationPourCalcul.min, configurationPourCalcul.max));
    }

    const arithmeticExpression = `${num1} ${operation} ${num2} =`;
    document.getElementById("arithmeticExpression").textContent = arithmeticExpression;
    startTimer();
}

//Evenement quand le user press enter : demande validation et appelle la methode pour effectuer les changements necessaires
const inputField = document.getElementById('reponseUser');
inputField.addEventListener('keypress', (toucheEnter) => {
    if (toucheEnter.keyCode === 13) {
        toucheEnter.preventDefault();
        const reponseUser = inputField.value.trim();
        if (reponseUser != '') {
            validationReponse(reponseUser);
            inputField.value = '';
            UpdateGameScreen();
        }
    }
});

//pour gerer le timer
let intervalleTimer;
let timerIsOn;
function startTimer() {
    if (intervalleTimer) {
        clearInterval(intervalleTimer);
    }
    if (timerIsOn) {
        document.getElementById('clock_sound').play();
        const tempsTotal = 10;
        const timerVisuel = document.getElementById('timerBar');
        let tempsRestant = tempsTotal;

        timerVisuel.classList.remove('transition');
        timerVisuel.style.width = '100%';

        setTimeout(() => {
            timerVisuel.classList.add('transition');
        }, 20);

        intervalleTimer = setInterval(() => {
            if (tempsRestant > 0) {
                tempsRestant--;
                const pourcentage = (tempsRestant / tempsTotal) * 100;
                timerVisuel.style.width = pourcentage + '%';
            }
            else {
                clearInterval(intervalleTimer);
                const reponseUser = inputField.value.trim();
                validationReponse(reponseUser);
                inputField.value = '';
                UpdateGameScreen();
            }
        }, 1000);
    }

}

//Validation de la reponse
let nbDeBonneReponses = 0
let nbDeMauvaiseReponses = 0;
function validationReponse(reponse) {
    const bonneReponse = calculerbonnereponse();
    const reponseUser = parseFloat(reponse);
    if (reponseUser === bonneReponse) {
        nbDeBonneReponses++;
        document.getElementById('gamescreen').style.backgroundColor = 'green';
        document.getElementById('afficherBonneReponseSiErreur').textContent = '';
        document.getElementById('success_sound').play();
    }
    else {
        nbDeMauvaiseReponses++;
        document.getElementById('gamescreen').style.backgroundColor = 'red';
        document.getElementById('afficherBonneReponseSiErreur').innerHTML = 'La bonne réponse était : <br>' + document.getElementById("arithmeticExpression").textContent + ' ' + bonneReponse;
        document.getElementById('error_sound').play();
    }
}

//Calcule de la bonne reponse
function calculerbonnereponse() {
    let symboleCalcule;
    if (operation == 'x')
        symboleCalcule = '*';
    else if (operation == '÷')
        symboleCalcule = '/';
    else
        symboleCalcule = operation;
    return eval(`${num1} ${symboleCalcule} ${num2}`);
}

//Pour commencer le test
let testEstCommence = false
document.getElementById('formulaireChoix').addEventListener('submit', function (event) {
    event.preventDefault();
    CommencerTest();
});
function CommencerTest() {
    document.getElementById('MessageDebutFin').style.display = 'none';
    document.getElementById('arithmeticExpression').style.display = 'inline';
    document.getElementById('reponseUser').style.display = 'inline';
    document.getElementById('gamescreen').style.backgroundColor = 'white';
    document.getElementById('afficherBonneReponseSiErreur').style.display = 'inline';
    document.getElementById('afficherBonneReponseSiErreur').textContent = '';
    timerIsOn = document.getElementById('timercheck').checked;
    if (timerIsOn) {
        document.getElementById('timerBar').style.display = 'inline';
    }
    else {
        document.getElementById('timerBar').style.display = 'none';
        document.getElementById('clock_sound').pause();
    }
    document.getElementById('overlayDiffculty').style.pointerEvents = 'none';
    nbDeBonneReponses = 0;
    nbDeMauvaiseReponses = 0;
    inputField.value = '';
    configurationPourCalcul = getConfiguration(difficulte);
    document.getElementById('back_music').pause();
    choixOperations();
    afficherUnCalcul();
    ajoutsSpecifiques();
    testEstCommence = true;
}

async function endgameScreen() {
    document.getElementById('arithmeticExpression').style.display = 'none';
    document.getElementById('reponseUser').style.display = 'none';
    document.getElementById('MessageDebutFin').style.display = 'inline';
    document.getElementById('gamescreen').style.backgroundColor = 'white';
    document.getElementById('afficherBonneReponseSiErreur').style.display = 'none';
    document.getElementById('timerBar').style.display = 'none';
    document.getElementById('overlayDiffculty').style.pointerEvents = 'auto';
    if (intervalleTimer) {
        clearInterval(intervalleTimer);
    }
    document.getElementById('clock_sound').pause();
    testEstCommence = false;
    BoomBoomConfetti();
    document.getElementById('endgame_fanfare').play();
    await new Promise(resolve => setTimeout(resolve, 3000));
    document.getElementById('back_music').play();
}

//Pour le popup d'information
document.getElementById('boutoninfo').addEventListener('click', function (event) {
    document.getElementById('overlay').classList.add('active');
    document.getElementById('popup').style.display = 'block';
    event.stopPropagation();
});

document.getElementById('boutonok').addEventListener('click', function (event) {
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('popup').style.display = 'none';
    event.stopPropagation();  // Prevent triggering the document click event
});

document.getElementById('popup').addEventListener('click', function (event) {
    event.stopPropagation();  // Prevent triggering the document click event when clicking inside the popup
});

document.addEventListener('click', function () {
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('popup').style.display = 'none';
});

//Pour le changement de difficulte
let difficulte;
function selectedRadio() {
    document.querySelectorAll('.btn-group label').forEach(label => {
        if (label.querySelector('input').checked) {
            label.classList.add('active');
            difficulte = label.querySelector('input').value;
        }
        else {
            label.classList.remove('active');
        }
    });

    if (document.getElementById('tableClassement')) {
        tabPersonne = getCookies(difficulte);
        afficherTableauClassement();
    }
}

document.querySelectorAll('.btn-group input[type="radio"]').forEach(input => {
    input.addEventListener('change', selectedRadio);
});

selectedRadio();

//bouton pour reset la page
document.getElementById('formulaireChoix').addEventListener('reset', function (event) {
    event.preventDefault();
    location.reload();
});

//Pour gerer sound on et off
const volumeOnOFF = document.getElementById('volumeOnOFF');
let musicEstOn = true;
const lstAudios = document.body.querySelectorAll('audio');
volumeOnOFF.addEventListener('click', function () {
    musicEstOn = !musicEstOn;
    if (musicEstOn) {
        volumeOnOFF.innerHTML = '<i class="fa-solid fa-volume-high" style="font-size: x-large;"></i>';
        lstAudios.forEach(audio => {
            audio.muted = false;
        });
    }
    else {
        volumeOnOFF.innerHTML = '<i class="fa-solid fa-volume-xmark" style="font-size: x-large;"></i>';
        lstAudios.forEach(audio => {
            audio.muted = true;
        });
    }
})

//YEEEESSSS des confettis
function BoomBoomConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 70, spread: 180, ticks: 600, zIndex: 0 };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 90 * (timeLeft / duration);
        // Confetti from bottom-left
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: 0.1, y: 1 },
            gravity: 1
        }));
        // Confetti from bottom-right
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: 0.9, y: 1 },
            gravity: 1
        }));
    }, 400);
}