/*
Unica variabile globale. 
Contiene la lista completa dei gruppi una volta che questi vengono generati.
Può esser usata e richiamata ovunque nelle funzioni.
*/
var gruppi = [];

function generate(){
    let partecipanti = document.getElementById("partecipanti").value;
    let pGruppo = parseInt(document.getElementById("pGruppo").value);
    let result = document.getElementById("result");
    
    /*Genero la mia lista dei partecipanti*/
    let lista_partecipanti = generaPartecipanti(partecipanti);
    
    /*Mischio gli elementi all'interno della lista 
    e poi spezzo questa in gruppi diversi e separati*/
    randomizzaArray(lista_partecipanti)
    gruppi = spezzaListaInGruppi(lista_partecipanti, pGruppo);

    
    /*Riequilibrio i gruppi nel caso in cui uno di questi è troppo piccolo rispetto agli altri*/
    let ultimoListIndex = gruppi.length - 1;
    let partecipantiUltimoGruppo = gruppi[ultimoListIndex].length;

    if((gruppi[0].length/2) + 1 > partecipantiUltimoGruppo){
        alert(`l'ultimo gruppo essendo di ${partecipantiUltimoGruppo} persone verrà ridistribuito negli altri gruppi`);    
        while(gruppi[ultimoListIndex].length > 0){
            for(let i=0; i<gruppi.length; i++){
                if(i!== ultimoListIndex){
                    let persona = gruppi[ultimoListIndex].shift();
                    if(persona === undefined){
                        break;
                    }
                    gruppi[i].push(persona);
                }
            }
        }
        gruppi.pop();
    } 

    console.log(gruppi)
    
    /*Costruisco la tabella per visualizzare questa a schermo*/
    result.innerHTML = generaTabella(gruppi);
}

/*
Funzione che, dato un input, mi genera una lista di partecipanti
*/
function generaPartecipanti(partecipanti){
    let lista_partecipanti=[];
    for(i=1; i<=partecipanti; i++){
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
    array.sort(function() {
      return 0.5 - Math.random();
    });
}

/*
Funzione che mi genera una tabella che mi aiuta a visualizzare
su schermo i diversi gruppi.
Nel file style.css trovi lo stile dato alla tabella
*/
function generaTabella(lista) {
    let tabellaHTML = "<h2>Gruppi</h2><table>";
    let i = 1;
    // Itera attraverso ogni riga della lista
    lista.forEach(function(riga) {
      tabellaHTML += "<tr>";
      // Itera attraverso ogni elemento della riga
      tabellaHTML += "<td>" + "Gruppo " + i + "</td>";
      riga.forEach(function(elemento) {
        tabellaHTML += "<td>" + elemento + "</td>";
      });
      i++;
      tabellaHTML += "</tr>";
    });
    tabellaHTML += "</table>";
    tabellaHTML += `<button onclick="shuffle()">Shuffle</button>`
    return tabellaHTML;
}


/*
Funzione che mi genera i gruppi e richiama la funzione "Struttura file"
che mi porta ad assegnare ad ogni persona un ruolo all'interno del gruppo
*/
function shuffle(){
    var json_file = [];

    /*
    In questo ciclo for assegno ad ogni persona all'interno di ogni gruppo un ruolo
    richiamando la funzione assegnaRuolo
    */
    for(let i=0; i<gruppi.length; i++){
        nome = "gruppo - " + i;
        let info = assegnaRuolo(nome, gruppi[i])
        json_file.push(info)
    }

    console.log(json_file);

    let tabella = shuffleTheTester(json_file);
    creaTabellaShuffle(tabella);
}

/*
In questa funzione assegno un ruolo ad ogni partecipante
Regola:
Ogni gruppo deve avere:
1 Intervistatore
N note taker
1 Tester
*/
function assegnaRuolo(nome, gruppo){
    var json_group = {
        "nome": [],
        "partecipanti":[],

        "ruoli": {
            "interviewer": [],
            "note taker": [],
            "tester": []
        }
    };

    json_group.nome = nome;
    
    for(let i=0; i<gruppo.length; i++){
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

function shuffleTheTester(json_file){
    let testerDisponibili = [];
    let gruppi = json_file;

    gruppi.forEach(gruppo => {
        testerDisponibili = testerDisponibili.concat(gruppo.ruoli['tester']);
    });

    randomizzaArray(testerDisponibili);

    gruppi.forEach(gruppo => {
        let testerDisponibiliFiltrati = testerDisponibili.filter(tester => !gruppo.partecipanti.includes(tester));
        gruppo.ruoli['tester'] = testerDisponibiliFiltrati.splice(0, gruppo.ruoli['tester'].length);
    });
    console.log("TESTER SCAMBIATI", gruppi);
    return gruppi;
}

/*
Funzione che mi crea la tabella che identifica
Nome gruppo
Interviewer
Note Taker
Tester di altro gruppo:
*/
function creaTabellaShuffle(tabella){
    let shuffle = document.getElementById("shuffle");
    let allTable = "";
    for(let i=0; i<tabella.length; i++){
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
    shuffle.innerHTML = allTable;

}

