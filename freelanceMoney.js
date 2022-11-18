function CalculGain() {
  //On vérifie les inputs
  CheckInputs();

  //On récupère le formulaire dans le html
  let myForm = document.getElementById("formCalculGain");
  //On le transforme en objet FormData
  let formObj = new FormData(myForm);

  //Je veux créer une classe calculdata
  //Le constructeur récupère un objet formdata en parametre
  //et il sera similaire à l'objet Object ci-dessous

  //On récupère les inputs de notre formulaire par leurs noms
  let myCalculDatas = {
    tauxHoraire: formObj.get("TH"),
    tauxJournalier: formObj.get("TJM"),
    extras: formObj.get("Extras"),
    qtetauxHoraire: formObj.get("QteTH"),
    qtetauxJournalier: formObj.get("QteTJM"),
    qteextras: formObj.get("QteExtras"),
    charges: formObj.get("Charges"),

    gainHeure: function () {
      return this.tauxHoraire * this.qtetauxHoraire;
    },
    gainJour: function () {
      return this.tauxJournalier * this.qtetauxJournalier;
    },
    gainExtras: function () {
      return this.extras * this.qteextras;
    },
    totalBrut: function () {
      return this.gainHeure() + this.gainJour() + this.gainExtras();
    },
    chargeADeduire: function () {
      return this.totalBrut() * (this.charges / 100);
    },
    totalNet: function () {
      return this.totalBrut() - this.chargeADeduire();
    },
  };

  //Animer le résultat
  animateCompteur("resultatBrut", myCalculDatas.totalBrut());
  animateCompteur("resultatDifference", myCalculDatas.chargeADeduire());
  animateCompteur("resultatNet", myCalculDatas.totalNet());
}

async function animateCompteur(idARemplacer, total) {
  let cpt = 0;
  let animationDuration = 70;
  let monElementHtmlDeResultat = document.getElementById(idARemplacer);
  //total c'est 140
  //compter 140 en 1000 ms

  if (monElementHtmlDeResultat.innerText != total.toFixed(2) + " €") {
    let increment = Math.round(total / 10);
    if (increment == 0) increment = 1;
    while (cpt <= total) {
      monElementHtmlDeResultat.innerText = cpt.toFixed(2) + " €";
      await timer(animationDuration);
      cpt += increment;
    }

    monElementHtmlDeResultat.innerText = total.toFixed(2) + " €";
  }
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

//pour ne pas etre en negatif. ne pas mettre -100  au taux horaire  par exemple. Il change la valeur à 0
function CheckInputs() {
  let mesInputs = document.querySelectorAll(
    "#formCalculGain input.form-control"
  );

  mesInputs.forEach((monInput) => {
    //Vérifier si il vaut 0 ou plus
    if (monInput.value < 0) {
      monInput.value = 0;
    }
    //sauvegarder les cookies
    saveElementInCookies(monInput);
  });
}

//pour garder les cookies lorsque l'on rafraichis la page ( garder les chiffres apres raffraichissement)
function saveElementInCookies(input) {
  document.cookie = input.name + "=" + input.value;
}

//récupérer les cookies et mettre les valeurs dans mon input
function getCookie(input) {
  let mesCookies = document.cookie;
  //C'ets pour avoir ca TH=1; TJM=2.... intégrer le ; er espace après chaque chaine de caractère. découper ma chaine de caractère en tableau. c'ets le ; qui va séparer ma chaine d ecaractère en tableau
  //récupérer le nom de mes cookies
  const name = input.name + "=";
  const tableauCookies = mesCookies.split("; ");
  let valeurCookie = null;
  tableauCookies.forEach((cookie) => {
    //donne moi l'index qui se commence a l'index 0
    if (cookie.indexOf(name) === 0) {
      //on a chopé le bon cookie
      valeurCookie = cookie.substring(name.length);
      console.log(valeurCookie);
    }
  });
  return valeurCookie;
}

//Ajout des évènements
let btn = document.getElementById("buttonValidation");
btn.addEventListener("click", CalculGain);

//je récupère tous ce qui est à l'interieur de mes input
let mesInputs = document.querySelectorAll("#formCalculGain input.form-control");

mesInputs.forEach((monInput) => {
  //Si il a une valeur en cookie, lui donner
  let cookie = getCookie(monInput);

  if (cookie != undefined && cookie != null) {
    monInput.value = cookie;
  }
  //Pour effectuer le resultat directement sans cliquer sur calculer. il faut effectuer un querryselector ( ci-dessus) pour qu'ils puissent voir les noeuds er efectuer les calculs automatiquement
  monInput.addEventListener("keyup", CalculGain);
  monInput.addEventListener("change", CalculGain);
});
CalculGain();
