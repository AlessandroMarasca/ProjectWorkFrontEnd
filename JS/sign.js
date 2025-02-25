//PASSARE DA LOGIN A REGISTRAZIONE E VICEVERSA

document.addEventListener("DOMContentLoaded", function () {
    const registrati = document.getElementById("registrati");
    const accedi = document.getElementById("accedi");
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
            document.getElementById('aggiungiUtente').addEventListener('submit', function (event) {             // da prendere integralmente
                event.preventDefault();
                const nuovoUtente = {                       // const aggiornamento
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('typeEmailX').value,
                    cognome: document.getElementById('cognome').value,
                    numerocarta: document.getElementById('pIva').value,
                    password: document.getElementById('creapw').value
                };
                addUser(nuovoUtente);                       // update(aggiornamento)
            });

        }



