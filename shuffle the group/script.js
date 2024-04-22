/*
Unica variabile globale. 
Contiene la lista completa dei gruppi una volta che questi vengono generati.
Può esser usata e richiamata ovunque nelle funzioni.
*/
var gruppi = [];

/*Questo è il codice che mi serve a verificare determinate azioni nel primo form.
Regola fondamentale:
• Il numero dei partecipanti deve essere = alla lista dei nomi dei partecipanti
• 
*/
var numeroPartecipanti = undefined;
var persone
document.getElementById("partecipanti").addEventListener("input", function () {
    numeroPartecipanti = this.value;
});

document.getElementById("nomi").addEventListener("input", function () {
    let maxWords = numeroPartecipanti;
    let textarea = document.getElementById("nomi");

    textarea.addEventListener("input", function () {
        // Divido il testo della textarea in parole
        let words = textarea.value.split(/\s+/);
        let wordCount = words.length;
        if (wordCount > maxWords) {
            // Unisco le prime maxWords parole per ottenere il testo troncato
            let truncatedText = words.slice(0, maxWords).join(" ");
            // Imposto il testo troncato come nuovo valore della textarea
            textarea.value = truncatedText;
        }
    });
    console.log(textarea)
});


/**/

function generate() {

    let partecipanti = parseInt(document.getElementById("partecipanti").value);
    let pGruppo = parseInt(document.getElementById("pGruppo").value);

    const form = document.querySelector('form');

    /*
    Il tasto submit porta il reload automatico della pagina e per questo motivo
    devo fare il catch dell'evento e disabilitarlo
    */
    form.addEventListener('submit', function(event) {
      event.preventDefault();
    });

    if (partecipanti != undefined && !isNaN(pGruppo)) {

        console.log("pgruppo", pGruppo)
        /*Nella textarea Nomi è una stringa*/
        let nomi = document.getElementById("nomi").value;

        let result = document.getElementById("result");

        /*Elaboro la textarea e rendo i nomi come dei singoli valori 
        all'interno di una lista*/
        let listaNomi = [];
        if (nomi != "" || nomi != " ") {
            listaNomi = creaListaNomi(nomi);
        }

        /*Genero la mia lista dei partecipanti*/
        let lista_partecipanti = [];
        if (listaNomi.length === 1) {
            lista_partecipanti = generaPartecipanti(partecipanti);
        } else {
            lista_partecipanti = listaNomi;
        }


        /*Mischio gli elementi all'interno della lista 
        e poi spezzo questa in gruppi diversi e separati*/
        randomizzaArray(lista_partecipanti)
        gruppi = spezzaListaInGruppi(lista_partecipanti, pGruppo);


        /*Riequilibrio i gruppi nel caso in cui uno di questi è troppo piccolo rispetto agli altri*/
        let ultimoListIndex = gruppi.length - 1;
        let partecipantiUltimoGruppo = gruppi[ultimoListIndex].length;

        if ((gruppi[0].length / 2) + 1 > partecipantiUltimoGruppo) {
            alert(`l'ultimo gruppo essendo di ${partecipantiUltimoGruppo} persone verrà ridistribuito negli altri gruppi`);
            while (gruppi[ultimoListIndex].length > 0) {
                for (let i = 0; i < gruppi.length; i++) {
                    if (i !== ultimoListIndex) {
                        let persona = gruppi[ultimoListIndex].shift();
                        if (persona === undefined) {
                            break;
                        }
                        gruppi[i].push(persona);
                    }
                }
            }
            gruppi.pop();
        }

        console.log("Gruppi: " , gruppi)

        /*Costruisco la tabella per visualizzare questa a schermo*/
        result.innerHTML = generaTabella(gruppi);
    } else{
        console.log("errore")
    }
}

/*Funzione che, data una stringa contenente dei nomi, mi genera una lista di nomi*/
function creaListaNomi(nomi) {
    return nomi.split(" ");
}


/*
Funzione che, dato un input, mi genera una lista di partecipanti
*/
function generaPartecipanti(partecipanti) {
    let lista_partecipanti = [];
    for (i = 1; i <= partecipanti; i++) {
        lista_partecipanti.push("Persona-" + i);
    }
    return lista_partecipanti;
}

/*
Funzione che mi permette di spezzare la lista in sotto liste.
Genera una matrice dove ogni singola lista contenuta dentro la matrice
rappresenta un gruppo.
*/
function spezzaListaInGruppi(lista, dimensioneGruppo) {
    let gruppi = [];
    for (var i = 0; i < lista.length; i += dimensioneGruppo) {
        gruppi.push(lista.slice(i, i + dimensioneGruppo));
    }
    return gruppi;
}


/*
Funzione che utilizzo per Mischiare gli elementi all'interno
dell'array. Questo mi permette di:
1) Creare gruppi misti
2) Assegnare ruoli casuali all'interno dei gruppi
*/
function randomizzaArray(array) {
    array.sort(function () {
        return 0.5 - Math.random();
    });
}

/*
Funzione che mi genera una tabella che mi aiuta a visualizzare
su schermo i diversi gruppi.
Nel file style.css trovi lo stile dato alla tabella
*/
function generaTabella(lista) {
    let tabellaHTML = `<div class="gruppiGenerati">
    <h2>Gruppi generati!</h2>
    <p>Ovviamente non potevano che essere tutti casuali! 😁</p>
    </div>
    <table>`;
    let i = 0;
    // Itera attraverso ogni riga della lista
    lista.forEach(function (riga) {
        tabellaHTML += "<tr>";
        // Itera attraverso ogni elemento della riga
        tabellaHTML += "<td><p>" + "Gruppo " + i + "</p></td>";
        riga.forEach(function (elemento) {
            tabellaHTML += "<td>" + elemento + "</td>";
        });
        i++;
        tabellaHTML += "</tr>";
    });
    tabellaHTML += "</table>";
    tabellaHTML += `<button onclick="shuffle()">Time to TEST!</button>`
    return tabellaHTML;
}


/*
Funzione che mi genera i gruppi e richiama la funzione "Struttura file"
che mi porta ad assegnare ad ogni persona un ruolo all'interno del gruppo
*/
function shuffle() {
    /*Ho trovato necessario tenere una copia del gruppo il che mi permette di fare
    più volte lo shuffle mantenendo gli stessi gruppi*/
    let copiaGruppi = []
    gruppi.forEach(gruppo => {
        let lista = []
        for (let i = 0; i < gruppo.length; i++) {
            lista.push(gruppo[i])
        }
        copiaGruppi.push(lista)
    });

    var json_file = [];
    /*
    In questo ciclo for assegno ad ogni persona all'interno di ogni gruppo un ruolo
    richiamando la funzione assegnaRuolo
    */
    for (let i = 0; i < copiaGruppi.length; i++) {
        nome = "Gruppo - " + i;
        let info = assegnaRuolo(nome, copiaGruppi[i])
        json_file.push(info)
    }

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
    let gruppi = json_file;

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
    allTable += `</div>`
    shuffle.innerHTML = allTable;

}
