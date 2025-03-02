

document.addEventListener("DOMContentLoaded", function () {
    const registrati = document.getElementById("register");
    const accedi = document.getElementById("login");
    const loginForm = document.querySelector(".login-section");
    const registrazioneForm = document.querySelector(".register-section");
    const inizioForm = document.querySelector(".iniziale");
    const profilo = document.getElementById("profilo"); //profilo
    const carrello = document.querySelector(".cart"); //carrello
    const ruolo = localStorage.getItem("ruolo"); //per prendere il ruolo
    const log = document.getElementById("login/logout");
    //per far vedere il carrello solo se si è loggati
    if (ruolo === "RISTORATORE" || ruolo === "USER") {
            
        carrello.style.display = "block";
        profilo.style.display = "block";
    } else {
        profilo.style.display = "none";
        carrello.style.display = "none";
    }
    
    log.addEventListener("click", function (event){
        const ruolo = localStorage.getItem("ruolo");
        if(ruolo === null){
            window.location.href = "login.html";
        }
         else {
            logout();
            window.location.href = "index.html"
        }
    });

   //funzione per andare al profilo solo se si è loggati
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

    // Nascondi il form di registrazione e login all'inizio
    registrazioneForm.classList.remove("show");
    loginForm.classList.remove("show");
    inizioForm.classList.add("show");

    // Gestione passaggio da login a registrazione
    registrati.addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.classList.remove("show");
        registrazioneForm.classList.add("show");
        inizioForm.classList.remove("show");
    });

    // Gestione passaggio da registrazione a login
    accedi.addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.classList.add("show");
        registrazioneForm.classList.remove("show");
        inizioForm.classList.remove("show");
    });
});

// Mostra o nascondi password
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const passwordField = this.previousElementSibling;
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            this.innerHTML = '🔓';
        } else {
            passwordField.type = 'password';
            this.innerHTML = '🔒';
        }
    });
});

// Funzione per ottenere headers di autorizzazione
function getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return token ? { "Authorization": "Bearer " + token } : {};
}

// Gestione invio form registrazione
document.getElementById('registrazione').addEventListener('submit', function (event) {
    event.preventDefault();

    console.log("Form di registrazione inviato");

    const nomeInput = document.getElementById('nome').value;
    const cognomeInput = document.getElementById('cognome').value;
    const emailInput = document.getElementById('email').value;
    const numeroCarta = document.getElementById('numero_carta').value;
    const passwordInput = document.getElementById('reg-password').value;
    let ruoloInput = document.getElementById("attivitaCheckbox").checked ? 1 : 0;
    
    if (numeroCarta === "" || numeroCarta.length !== 16 || isNaN(numeroCarta)) {
        alert("Il numero della carta deve essere un numero di 16 cifre.");
        return;
    }

    const nuovoUtente = {
        nome: nomeInput,
        cognome: cognomeInput,
        email: emailInput,
        numeroCarta: numeroCarta,
        password: passwordInput,
        ruolo: ruoloInput
    };

    console.log("Nuovo utente:", nuovoUtente);

    fetch('http://localhost:8080/api/utente/aggiungi', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuovoUtente)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore durante la registrazione');
        }
        return response.json();
    })
    .then(data => {
        console.log('Utente registrato:', data);
        alert("Registrazione completata! Ora puoi accedere.");
        
        // Reindirizza al login con i campi precompilati
        window.location.replace("login.html");
        localStorage.setItem("emailTemp", emailInput);
        localStorage.setItem("passwordTemp", passwordInput);
    })
    .catch(error => {
        console.error('Errore:', error);
    });
});
window.addEventListener("load", function () {
    const emailTemp = localStorage.getItem("emailTemp");
    const passwordTemp = localStorage.getItem("passwordTemp");
    
    if (emailTemp && passwordTemp) {
        document.getElementById("email-login").value = emailTemp;
        document.getElementById("password-login").value = passwordTemp;
        
        localStorage.removeItem("emailTemp");
        localStorage.removeItem("passwordTemp");
    }
});
    

function login(email, password) {
    fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Login fallito! Controlla le credenziali.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Login effettuato:", data);
       
    console.log("Ruolo dell'utente:", data.ruolo); // ✅ Mostra il ruolo
    localStorage.setItem("token", data.token); // ✅ Salva il token per le richieste future
        if (data.token) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("ruolo", data.ruolo); 
            localStorage.setItem("id", data.id);
           // document.getElementById("logoutButton").style.display = "block"; 
            
            document.querySelector(".login-section").style.display = "none"; 
            alert("Accesso effettuato con successo!");
        }
        console.log("Ruolo inviato al backend:", data.ruolo);
        redirectUser(data.ruolo); 
    })
    .catch(error => {
        console.error("Errore nel login:", error);
        const loginError = document.getElementById("loginError");  
        if (loginError) {
            loginError.textContent = error.message;
            loginError.style.display = "block";  
        }
    });
}


// Metodo per reindirizzare l'utente in base al ruolo
function redirectUser(ruolo) {
    if (ruolo === "RISTORATORE") ruolo = 1;
    else if (ruolo === "USER") ruolo = 0;
    
    console.log("Ruolo dell'utente (convertito):", ruolo);

    if (ruolo === 1) { 
        window.location.href = "../HTML/dashboard_ristorante.html";
    } else if (ruolo === 0) { 
        window.location.href = "../HTML/index.html";
    }
}



// Gestione invio form login
document.getElementById("accedi").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;
    login(email, password);
    

});

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






