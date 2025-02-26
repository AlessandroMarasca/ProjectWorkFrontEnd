//PASSARE DA LOGIN A REGISTRAZIONE E VICEVERSA
//CLIENTE E RISTORATORE BOTTONI???

document.addEventListener("DOMContentLoaded", function () {
    const registrati = document.getElementById("registrazione");
    const accedi = document.getElementById("login");
    const loginForm = document.querySelector(".login-section");
    const registrazioneForm = document.querySelector(".register-section");

    //nascondi il form di registrazione all'inizio
    registrazioneForm.style.display = "none";

    //gestione passaggio da login a registrazione
    registrati.addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.style.display = "none";
        registrazioneForm.style.display = "block";
    });

    //gestione passaggio da registrazione a login
    accedi.addEventListener("click", function (event) {
        event.preventDefault();
        registrazioneForm.style.display = "none";
        loginForm.style.display = "block";
    });
});

//mostra o nascondi password
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

//CONTROLLO PASSWORD REGISTRAZIONE
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".registrazioneform");
    const submitButton = document.querySelector(".btn-outline-black");

    submitButton.addEventListener("click", function (event) {
        const password = document.getElementById("reg-password").value;



    });
});

//FUNZIONE PER OTTENERE HEADERS AUTORIZZAZIONE??
function getAuthHeaders() {                     // COPIARE E METTERE A INIZIO PROFILO.JS
    const token = localStorage.getItem("authToken");
    return token ? { "Authorization": "Bearer " + token } : {};
}

//REGISTRAZIONE UTENTE
function addUser(nuovoUtente) {
    fetch('http://localhost:8080/api/utente/aggiungi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
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
            document.querySelector(".registrazioneform").style.display = "none";
            document.querySelector(".loginform").style.display = "block";
        })
    //GESTIONE INVIO FORM REGISTRAZIONE
    document.getElementById('registrati').addEventListener('submit', function (event) {             // da prendere integralmente
        event.preventDefault();
        const nuovoUtente = {                       // const aggiornamento
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cognome: document.getElementById('cognome').value,
            numerocarta: document.getElementById('num-carta').value,
            password: document.getElementById('reg-password').value
        };
        addUser(nuovoUtente);                       // update(aggiornamento)
    });

}
//LOGIN UTENTE
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
                console.log("ciao");
                throw new Error("Login fallito :( Controlla le credenziali!");
            }
            return response.json();
        })
        .then(data => {
            console.log("Login effettuato:", data);

            if (data.token) {
                localStorage.setItem("authToken", data.token);
                document.getElementById("logoutButton").style.display = "block"; //ce lo abbiamo?
                document.querySelector(".loginform").style.display = "none";
                alert("Accesso effettuato con successo!");

                window.location.replace("index.html"); //reindirizzamento 
            }
        })
        .catch(error => {
            console.error("Errore nel login:", error);
            const loginError = document.getElementById("loginError");  //ce lo abbiamo??
            loginError.textContent = error.message;
            loginError.style.display = "block";
            //alert(error.message);
        });
}
    //GESTIONE INVIO FORM LOGIN
document.getElementById("accedii").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
});



