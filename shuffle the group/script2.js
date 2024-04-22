var form = document.querySelector(`form`);
var tbodyElement = document.querySelector("tbody");
var tableElement = document.querySelector("table");
var lastHighlightedRow = null;

function AggiungiGruppo(e) {
    e.preventDefault();
    let gruppo = document.getElementById("gruppo").value;
    let partecipanti = document.getElementById("partecipanti").value;


    tbodyElement.innerHTML += `
        <tr>
            <td contenteditable="true">${gruppo}</td>
            <td contenteditable="true">${partecipanti}</td>
            <td>
            <button class="deleteBtn"><img class="deleteBtn" src="trash.png" alt="" width="15px" height="20px"></button>
            <button class="editBtn"><img src="pencil.png" class="editBtn" alt="" width="20px" height="20px"></button>
            </td>
            
        </tr>
    `;

    // Resetta i dati presenti all'interno del form
    form.reset();

    // Mostra la tabella se e solo se si è premuto "submit"
    tableElement.style.display = "table";

    // Controllo il numero di gruppi
    abilitaPulsante();
}

function EliminaRiga(e) {
    if (!e.target.classList.contains("deleteBtn")) {
        return;
    }
    let btn = e.target;
    btn.closest("tr").remove();
    // Controllo che il numero di gruppi sia maggiore o uguale a 2
    abilitaPulsante();
}

function ModificaContenuto(e) {
    var cella = e.target;
    cella.contentEditable = true;
    cella.focus();

    cella.addEventListener("blur", function () {
        cella.contentEditable = false;
        abilitaPulsante();
    });
}

function EvidenziaPartecipanti(e) {
    // Rimuove l'evidenziazione dalla riga precedentemente selezionata
    if (lastHighlightedRow) {
        var cellePartecipanti = lastHighlightedRow.querySelectorAll("td:nth-child(1), td:nth-child(2)");
        cellePartecipanti.forEach(function (cella) {
            cella.style.backgroundColor = "";
        });
    }

    // Evidenzia la riga corrente
    var riga = e.target.closest("tr");
    var cellePartecipanti = riga.querySelectorAll("td:nth-child(1), td:nth-child(2)");
    cellePartecipanti.forEach(function (cella) {
        cella.style.backgroundColor = "#E6E6FA";
        cella.style.border = "2px solid black"
    });

    // Salva la riga evidenziata per poterla rimuovere successivamente
    lastHighlightedRow = riga;
}

// Rimuove l'evidenziazione quando si clicca fuori dalla tabella o su un'altra riga
document.addEventListener("click", function (e) {
    if (!e.target.closest("#tabella")) {
        if (lastHighlightedRow) {
            var cellePartecipanti = lastHighlightedRow.querySelectorAll("td:nth-child(1), td:nth-child(2)");
            cellePartecipanti.forEach(function (cella) {
                cella.style.backgroundColor = "";
                cella.style.border = "";
            });
            lastHighlightedRow = null;
        }
    }
});


function abilitaPulsante() {
    var righe = document.querySelectorAll("#tabella tbody tr");
    var pulsante = document.querySelector(".button1");
    if (righe.length >= 2) {
        pulsante.style.display = "block";
        pulsante.disabled = false;
    } else {
        pulsante.style.display = "none";
    }
}

/*VARIABILE GLOBALE*/
var datiMatrice = [];

function raggruppaDati() {
    datiMatrice = [];
    var righe = document.querySelectorAll("#tabella tbody tr");
    righe.forEach(function (riga) {
        var celle = riga.querySelectorAll("td");
        var datiRiga = [];
        celle.forEach(function (cella) {
            if(cella.textContent.trim() !== ''){
                datiRiga.push(cella.textContent.trim());
            }
        });
        let nomi = datiRiga[1].split(' ');
        datiRiga[1] = nomi;
        datiMatrice.push(datiRiga);
    });
    shuffle();
    document.getElementById("button1").disabled = true;
}


form.addEventListener("submit", AggiungiGruppo);
tableElement.addEventListener("click", EliminaRiga);
tableElement.addEventListener("dblclick", ModificaContenuto);
tableElement.addEventListener("click", function (e) {
    if (e.target.classList.contains("editBtn")) {
        EvidenziaPartecipanti(e);
    }
});




/*SCRIPT.JS RIGA 206-210 → Genera il nome del gruppo e poi passa una matrice di dati 
[[paolo, luca, lucia][elisa, anna, Lorenzo]]*/


/*SEGUE DI SEGUITO UNA COPIA DI UNA SERIE DI METODI CONTENUTI DENTRO 
SCRIPT.JS

L'IMPORT E L'EXPORT STAVANO DANDO PROBLEMI. 

DA RISOLVERE!!! 


*/

function randomizzaArray(array) {
    array.sort(function () {
        return 0.5 - Math.random();
    });
}

function shuffle() {
    let copiaDatiMatrice = JSON.parse(JSON.stringify(datiMatrice)); // Creo una copia dei dati per evitare modifiche dirette

    var json_file = copiaDatiMatrice.map(element => {
        let nomeGruppo = element[0];
        let partecipantiGruppo = element[1];
        let info = assegnaRuolo(nomeGruppo, partecipantiGruppo);
        return info;
    }); 

    console.log("JSON:", json_file);
    shuffleTheTester(json_file);
}

/*
In questa funzione assegno un ruolo ad ogni partecipante
Regola:
Ogni gruppo deve avere:
1 Intervistatore
N note taker
1 Tester
*/
function assegnaRuolo(nome, gruppo) {
    var json_group = {
        "nome": [],
        "partecipanti": [],

        "ruoli": {
            "interviewer": [],
            "note taker": [],
            "tester": []
        }
    };

    json_group.nome = nome;

    for (let i = 0; i < gruppo.length; i++) {
        json_group.partecipanti.push(gruppo[i]);
    }

    randomizzaArray(gruppo);

    partecipanti = gruppo;
    json_group.ruoli.interviewer.push(partecipanti.shift()); // Assegna un intervistatore
    json_group.ruoli["tester"].push(partecipanti.pop()); // Assegna un tester

    // Assegna i note taker
    while (partecipanti.length > 0) {
        json_group.ruoli["note taker"].push(partecipanti.pop());
    }

    return json_group;
}

/*
Funzione che dato un file json prende le sole liste
dei Note Taker Available all'interno dei gruppi e
porta questi in gruppi random.
Per far ciò:

1) Raccolgo tutti gli available tester in un'unica lista

2) Mischio la lista chiamando randomizzaArray

3) Assegno gli available tester alle liste dei gruppi
iniziando dal primo e procedendo fino all'ultimo.
Controllo sempre che il tester inserito non fa parte
del suo gruppo di appartenenza.
*/

function shuffleTheTester(json_file) {
    let testerDisponibili = [];
    let gruppi = JSON.parse(JSON.stringify(json_file)); // Creo una copia dei dati per evitare modifiche dirette

    gruppi.forEach(gruppo => {
        testerDisponibili = testerDisponibili.concat(gruppo.ruoli['tester']);
    });

    console.log("tester disponibili: ", testerDisponibili)


    /*Per numeri di gruppi pari o dispari non si può applicare lo stesso algoritmo*/
    if (gruppi.length % 2 == 0) {
        randomizzaArray(testerDisponibili);
        gruppi.forEach(gruppo => {
            for (let i = 0; i < testerDisponibili.length; i++) {
                if (gruppo.ruoli[`tester`] != testerDisponibili[i]) {
                    gruppo.ruoli[`tester`] = testerDisponibili[i];
                    let indice = testerDisponibili.indexOf(testerDisponibili[i])
                    testerDisponibili.splice(indice, 1);
                    break;
                }
            }
        });
    }
    /*Devo trovare un modo ulteriore per randomizzare la mescolanza nel caso di gruppi dispari*/
    else {
        let testerDisponibiliReverse = testerDisponibili.reverse();
        console.log("lista reverse: ", testerDisponibiliReverse)
        gruppi.forEach(gruppo => {
            gruppo.ruoli[`tester`] = testerDisponibiliReverse[0];
            let indice = 0;
            testerDisponibiliReverse.splice(indice, 1);
        });
    }

    creaTabellaShuffle(gruppi);
    return json_file
}
/*
Funzione che mi crea la tabella che identifica
Nome gruppo
Interviewer
Note Taker
Tester di altro gruppo:
*/
function creaTabellaShuffle(tabella) {
    let shuffle = document.getElementById("shuffle");
    
    let tabsElement = document.getElementById("tabs");

    if (tabsElement) {
        document.getElementById("tabs").innerHTML = " ";
    } else{
        console.log(false);
    }

    let allTable = `<div class="test">
    <h2>Testa il prototipo!</h2>
    <p>Per ogni persona del gruppo è stato assegnato un ruolo. <br> I <b>tester</b> nei gruppi appartengono a gruppi diversi.</p>
    <button onclick="shuffle()">Rimescola i ruoli!</button>
    </div>
    <div id="tabs">`;
    for (let i = 0; i < tabella.length; i++) {
        let tableHTML = `<div>
        <h2>${tabella[i].nome}</h2>
        <table>
           <tr>
               <th>Ruolo</th>
               <th>Partecipanti</th>
           </tr>
           <tr>
                <th>Interviewer</th>
                <th>${tabella[i].ruoli['interviewer']}</th>
           </tr>
           <tr>
                <th>Note Taker</th>
                <th>${tabella[i].ruoli['note taker']}</th>
           </tr>
           <tr>
                <th>Tester</th>
                <th>${tabella[i].ruoli['tester']}</th>
           </tr>
        </table>
        </div>`;

        allTable += tableHTML;
    }
    allTable += `</div>`;
    shuffle.innerHTML = allTable;
}



