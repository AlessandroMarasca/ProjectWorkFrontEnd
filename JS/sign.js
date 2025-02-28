

document.addEventListener("DOMContentLoaded", function () {
    const registrati = document.getElementById("register");
    const accedi = document.getElementById("login");
    const loginForm = document.querySelector(".login-section");
    const registrazioneForm = document.querySelector(".register-section");
    const inizioForm = document.querySelector(".iniziale");


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
    event.preventDefault(); // Preveniamo il comportamento di submit predefinito del form

    console.log("Form di registrazione inviato");

    // Ottieni i valori dai campi del form
    const nomeInput = document.getElementById('nome').value;
    const cognomeInput = document.getElementById('cognome').value;
    const emailInput = document.getElementById('email').value;
    const numeroCarta = document.getElementById('numero_carta').value;
    const passwordInput = document.getElementById('reg-password').value;
    let ruoloInput = document.getElementById("attivitaCheckbox").checked ? 1 : 0;
    
    // Controlla se il numero della carta è valido
    if (numeroCarta === "") {
        alert("Il numero della carta è obbligatorio.");
        return;  // Se il numero della carta è vuoto, fermiamo l'esecuzione
    }

    if (numeroCarta.length !== 16 || isNaN(numeroCarta)) {
        alert("Il numero della carta deve essere un numero di 16 cifre.");
        return;  // Se il numero della carta non è valido, fermiamo l'esecuzione
    }

    // Crea l'oggetto utente con i dati della registrazione
    const nuovoUtente = {
        nome: nomeInput,
        cognome: cognomeInput,
        email: emailInput,
        numeroCarta: numeroCarta,  // Assicurati che questo campo esista
        password: passwordInput,
        ruolo: ruoloInput
    };

    console.log("Nuovo utente:", nuovoUtente);

    // Invia i dati al backend
    fetch('http://127.0.0.1:8080/api/utente/aggiungi', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuovoUtente)  // Invia i dati come JSON
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
        window.location.replace("login.html");
        
    })
    .catch(error => {
        console.error('Errore:', error);
    });
})
    

function login(email, password) {
    fetch("http://127.0.0.1:8080/api/login", {
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
    alert("Accesso effettuato con successo!");

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
        // Nasconde il pulsante Logout e mostra il form di login
        //document.getElementById("logoutButton").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
        window.location.replace("login.html"); // Reindirizza alla pagina di login
    })
    .catch(error => {
        console.error('Errore durante il logout:', error);
    });
}

//LOGOUT UTENTE

// Gestione del pulsante di logout
document.getElementById('logoutButton').addEventListener('click', function () {
    logout();
});



