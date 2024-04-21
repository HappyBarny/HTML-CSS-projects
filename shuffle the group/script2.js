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

    form.reset();
}

function EliminaRiga(e) {
    if (!e.target.classList.contains("deleteBtn")) {
        return;
    }
    let btn = e.target;
    btn.closest("tr").remove();
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

form.addEventListener("submit", AggiungiGruppo);
tableElement.addEventListener("click", EliminaRiga);
tableElement.addEventListener("dblclick", ModificaContenuto);
tableElement.addEventListener("click", function (e) {
    if (e.target.classList.contains("editBtn")) {
        EvidenziaPartecipanti(e);
    }
});