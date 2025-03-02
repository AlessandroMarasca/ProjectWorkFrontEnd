
document.addEventListener("DOMContentLoaded", function () {
    const profilo = document.querySelector(".profile_login"); //profilo
    const carrello = document.querySelector(".cart"); //carrello
    const ruolo = localStorage.getItem("ruolo"); //per prendere il ruolo
    const log = document.querySelector(".logout");
    const ristoratore = document.querySelector(".restaurant");
    
    

    //per far vedere il carrello solo se si è loggati
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

    //già c'era
    let myCarousel = new bootstrap.Carousel(document.querySelector("#customCarousel"), {
        interval: 3000,
        ride: "carousel"
    });
});

//aggiunta
function getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return token ? { "Authorization": "Bearer " + token } : {};
}
function logout() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.error("Nessun token trovato nel localStorage");
        localStorage.removeItem("authToken");
        localStorage.removeItem("ruolo");
        window.location.replace("login.html");
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
            console.warn('Logout fallito, ma rimuovo comunque il token');
        }
        return response.text(); // Usa text() invece di json() per evitare errori di parsing
    })
    .then(() => {
        console.log('Logout effettuato, rimuovo token');
        localStorage.removeItem("authToken");
        localStorage.removeItem("ruolo");
        window.location.replace("login.html"); 
    })
    .catch(error => {
        console.error('Errore durante il logout:', error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("ruolo");
        window.location.replace("login.html");
    });
}

async function cercaRistoranti(query) {
    try {
        const response = await fetch(`http://localhost:8080/api/ristorante/ricerca?descrizione=${encodeURIComponent(query)}`);

        const caroselloContainer = document.getElementById("ristorantiCarousel");
        const caroselloInner = document.getElementById("ristorantiCarouselInner");

        if (!caroselloInner) {
            console.error("Elemento carosello non trovato!");
            return;
        }

        caroselloInner.innerHTML = ""; // Pulisce il carosello prima di aggiungere nuovi risultati

        if (response.status === 204) {
            console.warn("Nessun ristorante trovato");
            caroselloInner.innerHTML = `<div class="carousel-item active"><p class="text-center">Nessun ristorante trovato.</p></div>`;
            caroselloContainer.classList.add("show");
            return;
        }

        const ristoranti = await response.json();

        if (ristoranti.length === 0) {
            caroselloInner.innerHTML = `<div class="carousel-item active"><p class="text-center">Nessun ristorante trovato.</p></div>`;
        } else {
            ristoranti.forEach((ristorante, index) => {
                const activeClass = index === 0 ? "active" : ""; // Il primo elemento deve avere "active"

                // Controllo se l'immagine esiste, altrimenti uso un placeholder
                const imgSrc = ristorante.id 
    ? `http://localhost:8080/ristorante/${ristorante.id}/foto` 
    : "/img/placeholder.jpg";


                caroselloInner.innerHTML += `
                    <div class="carousel-item ${activeClass}">
                        <div class="d-flex justify-content-center">
                            <div class="card custom-card" style="width: 18rem;">
                            
                                <img src="${imgSrc}" class="card-img-top restaurant-image" alt="${ristorante.nome}">
                                <div class="card-body">
                                    <h5 class="card-title">${ristorante.nome}</h5>
                                    <p class="card-text">${ristorante.descrizione}</p>
                                    <a href="ristorante.html?id=${ristorante.id}" class="btn btn-custom">Scopri di più</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        caroselloContainer.classList.add("show"); // Mostra il carosello con animazione
        console.log(ristoranti);
    } catch (error) {
        console.error("Errore durante la ricerca:", error);
    }
}

function aggiornaCarosello(ristoranti) {
    const carosello = document.getElementById("ristorantiCarousel");
    
    // Svuota il carosello prima di aggiornare i risultati
    carosello.innerHTML = "";

    if (ristoranti.length === 0) {
        carosello.innerHTML = "<p>Nessun ristorante trovato.</p>";
        return;
    }

    ristoranti.forEach((ristorante, index) => {
        const activeClass = index === 0 ? "active" : ""; // Il primo elemento deve avere la classe "active"
        carosello.innerHTML += `
            <div class="carousel-item ${activeClass}">
                <div class="card" style="width: 18rem; margin: auto;">
                    <img src="${ristorante.immagine || 'placeholder.jpg'}" class="card-img-top" alt="${ristorante.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${ristorante.nome}</h5>
                        <p class="card-text">${ristorante.descrizione}</p>
                        <a href="ristorante.html?id=${ristorante.id}" class="btn btn-primary">Scopri di più</a>
                    </div>
                </div>
            </div>
        `;
    });

    // Mostra il carosello
    carosello.style.display = "block";
}

    const barraRicerca = document.getElementById("cerca_ristoranti");
    const inviaRicerca = document.getElementById("barraForm");
    const caroselloRistoranti = document.getElementById("ristorantiCarousel");

    
    // Evento per la barra di ricerca
document.getElementById("barraForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const query = document.getElementById("cerca_ristoranti").value.trim();

    if (query) {
        cercaRistoranti(query);
    } else {
        alert("Inserire parametri nella ricerca");
    }
});
    
