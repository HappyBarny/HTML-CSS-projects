
/*Unica variabile globale che deve essere usata da diverse funzioni*/
var gruppi = [];

function generate(){
    let partecipanti = document.getElementById("partecipanti").value;
    let pGruppo = parseInt(document.getElementById("pGruppo").value);
    let result = document.getElementById("result");
    
    /*Genero la mia lista dei partecipanti*/
    let lista_partecipanti = generaPartecipanti(partecipanti);
    
    /*Shuffle della lista e poi spezzo questa in gruppi diversi e separati*/
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

    else{
        console.log("false");
    }
    console.log(gruppi)
    
    /*Costruisco la tabella per visualizzare questa a schermo*/
    result.innerHTML = generaTabella(gruppi);
}

function generaPartecipanti(partecipanti){
    let lista_partecipanti=[];
    for(i=1; i<=partecipanti; i++){
        lista_partecipanti.push("Persona-" + i);
    }
    return lista_partecipanti;
}

function spezzaListaInGruppi(lista, dimensioneGruppo) {
    let gruppi = [];
    for (var i = 0; i < lista.length; i += dimensioneGruppo) {
        gruppi.push(lista.slice(i, i + dimensioneGruppo));
    }
    return gruppi;
}


function randomizzaArray(array) {
    array.sort(function() {
      return 0.5 - Math.random();
    });
}


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

/*TEST: */
function shuffle(){
    var json_file = [];

    for(let i=0; i<gruppi.length; i++){
        nome = "gruppo - " + i;
        let info = strutturaFile(nome, gruppi[i])
        json_file.push(info)
    }

    console.log(json_file);
}


function strutturaFile(nome, gruppo){
    var json_group = {
        "nome": [],
        "partecipanti":[],

        "ruoli": {
            "interviewer": [],
            "note taker": [],
            "available-tester": []
        }
    };

    json_group.nome = nome;
    json_group.partecipanti = gruppo;

    randomizzaArray(gruppo);


    console.log("json group ",  json_group)

    partecipanti = gruppo;
    for (var i = 0; i < gruppo.length; i++) {
        var ruoloIndex = i % Object.keys(json_group.ruoli).length;
        var ruolo = Object.keys(json_group.ruoli)[ruoloIndex];
        json_group.ruoli[ruolo].push(partecipanti[i]);
    }

    return json_group;
}
