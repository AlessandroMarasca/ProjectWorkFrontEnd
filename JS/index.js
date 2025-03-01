
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

