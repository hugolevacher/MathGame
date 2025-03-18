//Session cookie pour le classement
var dateExpiration = new Date();
dateExpiration.setFullYear(dateExpiration.getFullYear() + 100);
//set cookies
function setCookies(pDifficulte) {
    const tabPersonneString = JSON.stringify(tabPersonne);
    document.cookie = `${pDifficulte}listClassement=${encodeURIComponent(tabPersonneString)}; expires=${dateExpiration.toUTCString()}`;
}
//get cookies
function getCookies(pDifficulte) {
    const cookieName = `${pDifficulte}listClassement=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) === 0) {
            const tabPersonneString = cookie.substring(cookieName.length, cookie.length);
            return JSON.parse(tabPersonneString);
        }
    }
    return [];
}
//liste de personne
let tabPersonne // ceci est fait dans CodeCommun>  = getCookies(difficulte);

//Pour savoir quoi faire apres la validation d'une reponse
function UpdateGameScreen() {
    if (nbDeMauvaiseReponses < 4) {
        document.getElementById('scoreActuel').textContent = 'Score actuel : ' + nbDeBonneReponses;
        afficherUnCalcul();
        if (nbDeMauvaiseReponses > 0) {
            document.getElementById('strike' + nbDeMauvaiseReponses).style.color = 'white';
            document.getElementById('strike' + nbDeMauvaiseReponses).style.backgroundColor = 'red';
        }
    }
    else {
        endgameScreen();
        document.getElementById('scoreActuel').style.display = 'none';
        document.getElementById('compteErreur').style.display = 'none';
        document.getElementById('MessageDebutFin').textContent = 'Vous avez eu un score de ' + nbDeBonneReponses;
        if (operations.length == 4 && timerIsOn) {
            if (nomJoueur != '') {
                let joueur = new Personne(nomJoueur, nbDeBonneReponses)
                if (tabPersonne.length < 10) {
                    tabPersonne.push(joueur)
                }
                else {
                    if (joueur.score > tabPersonne[tabPersonne.length - 1].score) {
                        tabPersonne[tabPersonne.length - 1] = joueur;
                    }
                }
                if (tabPersonne.length > 1) {
                    tabPersonne.sort((a, b) => b.score - a.score);
                }
                setCookies(difficulte);
            }
        }
        afficherTableauClassement();
    }
}

//Methode specifique a la page quand on commence le jeu
let nomJoueur = '';
function ajoutsSpecifiques() {
    document.getElementById('scoreActuel').style.display = 'inline';
    document.getElementById('scoreActuel').textContent = 'Score actuel : ' + nbDeBonneReponses;
    document.getElementById('compteErreur').style.display = 'inline'
    for (let i = 1; i < 4; i++) {
        document.getElementById('strike' + i).style.color = 'black';
        document.getElementById('strike' + i).style.backgroundColor = 'white';
    }
    nomJoueur = document.getElementById('nomDuJoueur').value;

    if (nomJoueur.includes(';')) {
        endgameScreen();
        document.getElementById('scoreActuel').style.display = 'none';
        document.getElementById('compteErreur').style.display = 'none';

        document.getElementById('MessageDebutFin').textContent = 'Oh! We have a real clown here :/';
        document.getElementById('clownMusic').play();
    }
}

//Objet personne avec nom et score
function Personne(nom, score) {
    this.nom = nom;
    this.score = score;
}

//fonction pour affichier la liste de personne dans le tableau de classement
const tableBody = document.querySelector('#tableClassement tbody');
function afficherTableauClassement() {
    tableBody.innerHTML = '';
    document.getElementById('titreClassement').innerHTML = '<i class="fa-solid fa-crown"></i>Classement niveau ' + difficulte;
    for (let i = 0; i < Math.min(10, tabPersonne.length); i++) {
        const row = document.createElement('tr');
        const positionCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');

        positionCell.textContent = i + 1;
        nameCell.textContent = tabPersonne[i].nom;
        scoreCell.textContent = tabPersonne[i].score;

        row.appendChild(positionCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        tableBody.appendChild(row);
    }
}