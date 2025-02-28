const listaR = document.getElementById('listaRistoranti');
// recupero il valore dell'id dal LocalStorage
const ristoratoreId = localStorage.getItem('id');

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
    fetch(`http://localhost:8080/api/utente/${ristoratoreId}/ristoranti`, {
        method: "GET",
        headers: {
            ...getAuthHeaders()
        }
    })
        .then(response => response.json())
        .then(ristorante => {
            const risto = ristorante.map(r => {
                return `<option value="${r.id}">${r.nome}</option>`;
            }).join('');
            listaR.innerHTML = risto;
            if (listaR.length < 1) {
                listaR.innerHTML = `<option value="nessuno">Nessun ristorante registrato</option>`;
                console.log("Nessun ristorante presente");
            }

        })
        .catch(error => console.error('errore: ', error));
});

// funzione per aprire la lista dei menù
listaR.addEventListener("click", function () {
    // assegno il valore del <select> della lista dei ristoranti a ristoId
    const ristoId = listaR.value;
    // controllo il valore in console
    console.log("Ristorante selezionato: " +ristoId);
    // punto la lista <select> dei menù
    const listaM = document.getElementById('nomeMenu');

    // fetch per il recupero della lista dei menù
    fetch(`http://localhost:8080/api/ristorante/${ristoId}/menu`, {
        method: "GET",
        headers: {
            ...getAuthHeaders()
        }
    })
        .then(response => response.json())
        .then(menu => {
            const menus = menu.map(m => {
                return `<option value="${m.id}">${m.nome}</option>`;
            }).join('');

            listaM.innerHTML = menus;
            // controllo listaM vuoto
            if (listaM.length < 1) {
                listaM.innerHTML = `<option value="nessuno">Nessun menù registrato</option>`;
                console.log("Nessun menù presente");
            }

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

//come recupero da console lo status dell'errore e come lo modifico da js?
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

// evento per il tasto 'crea menù' che reindirizza alla funzione per aggiungere un menù
document.getElementById('crea_menu').addEventListener('submit', function (event) {
    event.preventDefault(); // Preveniamo il comportamento di submit predefinito del form

    // Ottieni i valori dai campi del form
    const nomeMenuInput = document.getElementById('nomeM').value;
    const ristorante = document.getElementById('listaRistoranti').value;
    console.log(ristorante);

    if (nomeMenuInput === "") {
        alert("Il nome del menù è obbligatorio.");
        return;
    }


    // oggetto 'nuovo menù'
    const nuovoMenu = {
        nome: nomeMenuInput
    };

    console.log("Nuovo menu:", nuovoMenu);
    const URL = `http://localhost:8080/api/menu/${ristorante}/nuovo`;
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

});


// evento per il tasto 'crea menù' che reindirizza alla funzione per aggiungere un menù
document.getElementById('crea_categoria').addEventListener('submit', function (e) {
    e.preventDefault();

    const nomeCategoriaInput = document.getElementById('nuova').value;
    const menu = document.getElementById('nomeMenu').value;

    if (nomeCategoriaInput === "") {
        alert("Il nome della categoria è obbligatorio.");
        return;
    }

    // oggetto 'nuova categoria' 
    const nuovaCategoria = {
        nome: nomeCategoriaInput
    };

    console.log("Nuova categoria:", nuovaCategoria);
    const URL = `http://localhost:8080/api/categoria/${menu}`;
    console.log(URL);
    fetch(URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(nuovaCategoria)  // Invia i dati come JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante la creazione della categoria');
            }
            return response.json();
        })
        .then(data => {
            console.log('categoria registrata:', data);
            alert("Creazione categoria completata.");
        })
        .catch(error => {
            console.error('Errore:', error);
        });
});

document.getElementById('crea_piatti').addEventListener('submit', function(e) {
    e.preventDefault();

    const nomePiattoInput = document.getElementById('nomePiatto').value;
    const prezzoPiattoInput = document.getElementById('prezzoPiatto').value;
    const descrizionePiattoInput = document.getElementById('descrizionePiatto').value;
    const fileInput = document.getElementById('fotoPiatto');
    const fileFoto = fileInput.files[0];
    if (!fileFoto) {
        alert("Seleziona un file!");
        return;
    }
    console.log(nomePiattoInput, prezzoPiattoInput, descrizionePiattoInput, fileFoto);
    const formDataPiatto = new FormData();
    formDataPiatto.append("files", fileFoto);
    formDataPiatto.append("nome", nomePiattoInput);
    formDataPiatto.append("costo", prezzoPiattoInput);
    formDataPiatto.append("descrizione", descrizionePiattoInput);

    console.log(formDataPiatto);
    const categoria = document.getElementById('menuCategory').value;
    const URL = `http://localhost:8080/api/piatto/2`;
    console.log(URL);
    
    fetch(URL, {
        method: 'POST',
        headers: {
            ...getAuthHeaders()
        },
        body: formDataPiatto
    })
        .then (response => {
            if(!response.ok) {
                throw new Error ("Caricamento fallito");
            }
            return response.json();
        })
        .then(data => {
            console.log("Piatto aggiunto: ", formDataPiatto);
            alert("Piatto registrato!");
        })
        .catch(error => {
            console.error("Error: ", error);
        });
});