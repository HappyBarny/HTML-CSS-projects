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
        cella.style.backgroundColor = "#E6E6FA"; // Evidenzia in giallo
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
    } else {
        pulsante.style.display = "none";
    }
}


function raggruppaDati() {
    var righe = document.querySelectorAll("#tabella tbody tr");
    var datiMatrice = [];
    righe.forEach(function (riga) {
        var celle = riga.querySelectorAll("td");
        var datiRiga = [];
        celle.forEach(function (cella) {
            if(cella.textContent.trim() !== ''){
                datiRiga.push(cella.textContent.trim());
            }
        });
        datiMatrice.push(datiRiga);
    });
    console.log(datiMatrice);
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





