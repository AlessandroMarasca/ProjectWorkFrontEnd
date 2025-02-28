document.addEventListener("DOMContentLoaded", function () {
    const profilo = document.querySelector(".profile_login"); //profilo
    const carrello = document.querySelector(".cart"); //carrello
    const ruolo = localStorage.getItem("ruolo"); //per prendere il ruolo
    const log = document.querySelector(".logout");
    const ristoratore = document.querySelector(".restaurant");
    if (ruolo === "RISTORATORE") {
        ristoratore.style.display = "block";
        carrello.style.display = "block";
        profilo.style.display = "block";
    }
    else if (ruolo === "USER"){
        carrello.style.display = "block";
        profilo.style.display = "block";
        ristoratore.style.display = "none";

    } else {
        ristoratore.style.display = "none";
        profilo.style.display = "none";
        carrello.style.display = "none";
    }
    log.addEventListener("click", function (event){
        const ruolo = localStorage.getItem("ruolo");
        if(ruolo === null){
            window.location.href = "Login.html";
        }
         else {
            logout();
            window.location.href = "Login.html";
        }
    });
    profilo.addEventListener("click", function (event){
        const ruolo = localStorage.getItem("ruolo");
        if(ruolo === null){
            window.location.href = "login.html";
        }
        else if (ruolo === "RISTORATORE") {
            window.location.href = "profile.html"; // la tua pagina per i ristoratori
        }
        else if (ruolo === "USER") {
            window.location.href = "profile.html"; // la tua pagina per gli utenti
        } else {
            window.location.href = "login.html";
        }
    });
    // caricaCategorie(); // Carica le categorie all'avvio
    //caricaMenu(); // Carica i piatti all'avvio

    //già c'era
    const lista = document.getElementById('idUtente');

    fetch('http://localhost:8080/api/ristorante')
        .then(response => response.json())
        .then(ristorante => {
            const risto = ristorante.map(r => {
                return `<option value="${r.id}">${r.nome}</option>`;
            }).join('');
            lista.innerHTML = risto;

        })
        .catch(error => console.error('errore: ', error));

});
    //aggiunta
    function getAuthHeaders() {
        const token = localStorage.getItem("authToken");
        return token ? { "Authorization": "Bearer " + token } : {};
    }
    function logout() {
        // Recupera il token dal localStorage
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Nessun token trovato nel localStorage");
            return;
        }
    
        fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Logout fallito');
            }
            return response.json();
        })
        .then(data => {
            console.log('Logout effettuato:', data);
            // Rimuove il token dal localStorage
            localStorage.removeItem("authToken");
            localStorage.removeItem("ruolo"); // Rimuovi anche il ruolo
            document.getElementById("loginForm").style.display = "block";
            window.location.replace("login.html"); // Reindirizza alla pagina di login
        })
        .catch(error => {
            console.error('Errore durante il logout:', error);
        });
    }

// ** Fetch per Caricare le Categorie dal Backend **
/*function caricaCategorie() {
    fetch("Http:localhost:8080/api/categorie")
        .then(response => response.json())
        .then(data => {
            let menuCategory = document.getElementById("menuCategory");
            menuCategory.innerHTML = ""; // Svuota il select

            data.forEach(categoria => {
                let option = document.createElement("option");
                option.value = categoria;
                option.textContent = categoria;
                menuCategory.appendChild(option);
            });
        })
        .catch(error => console.error("Errore nel caricamento delle categorie:", error));
}*/




/*function addMenu() {
    let newMenu = document.getElementById("nuova").value.trim();
    if (newMenu === "") {
        alert("Inserisci un nome per il menù!");
        return;
    }

    fetch("http://localhost:8080/api/menu/" + id + "nuovo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria: newMenu })
    })
        .then(response => response.json())
        .then(() => {
            caricaMenu(); // Ricarica il select
            document.getElementById("nuova").value = ""; // Pulisce il campo
        })
        .catch(error => console.error("Errore nell'aggiunta del menù:", error));
}*/

// ** Fetch per Rimuovere un Menu
function removeMenu() {
    let selectedMenu = document.getElementById("menuCategory").value;
    if (!selectedMenu) {
        alert("Seleziona un menù da rimuovere!");
        return;
    }

    fetch(`http://localhost:8080/api/menu/" + id + "nuovo",${selectedCategory}`, { method: "DELETE" })
        .then(response => response.json())
        .then(() => caricaMenu()) // Ricarica il select
        .catch(error => console.error("Errore nella rimozione della categoria:", error));
}



// ** Fetch per Aggiungere una Categoria nel Backend **
function addCategory() {
    let newCategory = document.getElementById("nuova").value.trim();
    if (newCategory === "") {
        alert("Inserisci un nome per la nuova categoria!");
        return;
    }

    fetch("/api/categorie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria: newCategory })
    })
        .then(response => response.json())
        .then(() => {
            caricaCategorie(); // Ricarica il select
            document.getElementById("nuova").value = ""; // Pulisce il campo
        })
        .catch(error => console.error("Errore nell'aggiunta della categoria:", error));
}

// ** Fetch per Rimuovere una Categoria nel Backend **
function removeCategory() {
    let selectedCategory = document.getElementById("menuCategory").value;
    if (!selectedCategory) {
        alert("Seleziona una categoria da rimuovere!");
        return;
    }

    fetch(`/api/categorie/${selectedCategory}`, { method: "DELETE" })
        .then(response => response.json())
        .then(() => caricaCategorie()) // Ricarica il select
        .catch(error => console.error("Errore nella rimozione della categoria:", error));
}

// ** Fetch per Aggiungere un Piatto nel Backend **
function addMenuItem() {
    let category = document.getElementById("menuCategory").value;
    let name = document.getElementById("menuItem").value.trim();
    let price = document.getElementById("menuPrice").value.trim();
    let description = document.getElementById("menuDescrizione").value.trim();

    if (!category || name === "" || price === "" || isNaN(price)) {
        alert("Inserisci un nome valido e un prezzo numerico!");
        return;
    }

    fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria: category, nome: name, prezzo: parseFloat(price), descrizione: description })
    })
        .then(response => response.json())
        .then(() => {
            caricaMenu(); // Ricarica il menu
            document.getElementById("menuItem").value = "";
            document.getElementById("menuPrice").value = "";
            document.getElementById("menuDescrizione").value = "";
        })
        .catch(error => console.error("Errore nell'aggiunta del piatto:", error));
}

// ** Fetch per Caricare il Menu dal Backend **
function caricaMenu() {
    fetch("/api/menu")
        .then(response => response.json())
        .then(data => {
            let menuContainer = document.getElementById("menuContainer");
            menuContainer.innerHTML = ""; // Svuota il contenitore

            Object.keys(data).forEach(categoria => {
                let categorySection = document.createElement("div");
                categorySection.id = categoria;
                categorySection.innerHTML = `<h5>${categoria}</h5><ul class="list-group"></ul>`;

                data[categoria].forEach(piatto => {
                    let listItem = document.createElement("li");
                    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                    listItem.innerHTML = `
                        <span><strong>${piatto.nome}</strong> - €${piatto.prezzo.toFixed(2)}<br><small>${piatto.descrizione}</small></span>
                        <button class="btn btn-danger btn-sm" onclick="removeMenuItem('${categoria}', '${piatto.nome}', this)">❌</button>
                    `;
                    categorySection.querySelector("ul").appendChild(listItem);
                });

                menuContainer.appendChild(categorySection);
            });
        })
        .catch(error => console.error("Errore nel caricamento del menu:", error));
}

// ** Fetch per Rimuovere un Piatto nel Backend **
function removeMenuItem(categoria, nome, button) {
    fetch(`/api/menu/${categoria}/${nome}`, { method: "DELETE" })
        .then(response => response.json())
        .then(() => button.parentElement.remove()) // Rimuove dalla UI
        .catch(error => console.error("Errore nella rimozione del piatto:", error));
}



document.getElementById("crea_ristorante").addEventListener("submit", function (e) {
    e.preventDefault(); // Previene il comportamento predefinito del form

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) {
        alert("Seleziona un file!");
        return;
    }

    const nomeRistoranteInput = document.getElementById('inputNome').value;
    const partitaIvaInput = document.getElementById('inputPIva').value;
    const emailInput = document.getElementById('inputEmail').value;
    const telefonoInput = document.getElementById('inputTelefono').value;
    const indirizzoInput = document.getElementById('inputIndirizzo').value;
    const cittaInput = document.getElementById("inputCitta").value;
    const provinciaInput = document.getElementById("inputProvincia").value;
    let categoriaInput = document.getElementById("ristoranteCategory").value;
    const testoInput = document.getElementById("testo").value;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("nome", nomeRistoranteInput);
    formData.append("partitaIva", partitaIvaInput);
    formData.append("email", emailInput);
    formData.append("numeroTelefono", telefonoInput);
    formData.append("indirizzo", indirizzoInput);
    formData.append("citta", cittaInput);
    formData.append("provincia", provinciaInput);
    formData.append("tipo", categoriaInput);
    formData.append("descrizione", testoInput);

    // Chiamata all'endpoint POST per caricare l'immagine
    fetch("http://localhost:8080/api/ristorante", {
        method: "POST",
        headers: {
            ...getAuthHeaders()
        },
        mode: 'cors',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Caricamento fallito");
            }
            return response.json();
        })
        .then(data => {
            // Visualizza l'ID dell'immagine appena salvata
            console.log('Ristorante registrato:', formData);
            alert("Ristorante registrato! Ora puoi creare un menù.");
            window.location.replace("../HTML/index.html");
        })
        .catch(error => {
            document.getElementById("crea_ristorante").innerHTML = "Errore: " + error.message;
        });
});


function getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return token ? { "Authorization": "Bearer " + token } : {};
}
document.addEventListener("DOMContentLoaded", function () {

    const menuLink = document.querySelector("a[href='#gestioneMenu']");
    const dashboardTitle = document.querySelector(".dashboard");
    const gestioneMenuSection = document.getElementById("gestioneMenu");

    if (menuLink && dashboardTitle && gestioneMenuSection) {
        menuLink.addEventListener("click", function (event) {
            event.preventDefault();
            gestioneMenuSection.scrollIntoView({ behavior: "smooth" }); //
        });
    }
    const dashboardLink = document.querySelector("a[href='#']");
    if (dashboardLink && dashboardTitle) {
        dashboardLink.addEventListener("click", function (event) {
            event.preventDefault();
            dashboardTitle.scrollIntoView({ behavior: "smooth" });
        });
    }
});

document.getElementById('crea_menu').addEventListener('submit', function (event) {
    event.preventDefault(); // Preveniamo il comportamento di submit predefinito del form

    // Ottieni i valori dai campi del form
    const nomeMenuInput = document.getElementById('nomeM').value;
    const ristorante = document.getElementById('idUtente').value;
    console.log(ristorante);

    if (nomeMenuInput === "") {
        alert("Il nome del menù è obbligatorio.");
        return;  // Se il numero della carta è vuoto, fermiamo l'esecuzione
    }


    // Crea l'oggetto utente con i dati della registrazione
    const nuovoMenu = {
        nome: nomeMenuInput
    };

    console.log("Nuovo menu:", nuovoMenu);
    const URL = `http://localhost:8080/api/menu/4/nuovo`;
    console.log(URL);
    // Invia i dati al backend
    fetch(URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(nuovoMenu)  // Invia i dati come JSON
    })
        .then(response => {
            if (!response.ok) {

                throw new Error('Errore durante la creazione del menù');
            }
            return response.json();
        })
        .then(data => {
            console.log('Menù registrato:', data);
            alert("Creazione menù completata.");
        })
        .catch(error => {
            console.error('Errore:', error);
        });

})