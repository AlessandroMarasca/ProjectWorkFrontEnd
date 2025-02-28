document.addEventListener("DOMContentLoaded", function () {
    const profilo = document.querySelector(".profile_login"); //profilo
    const carrello = document.querySelector(".cart"); //carrello
    const ruolo = localStorage.getItem("ruolo"); //per prendere il ruolo
    const log = document.querySelector(".logout");
    const ristoratore = document.querySelector(".restaurant");
    const cartContainer = document.querySelector(".cart");
    const totalContainer = document.querySelector(".total span");
    const checkoutButton = document.querySelector(".checkout");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
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
    });// 🚀 Fetch dei prodotti dal backend Java
    async function fetchProducts() {
        try {
            let response = await fetch("http://localhost:8080/api/prodotti"); // Cambia con il tuo endpoint
            let products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Errore nel caricamento dei prodotti:", error);
        }
    }

    // 🎯 Mostrare i prodotti nella pagina
    function displayProducts(products) {
        const productContainer = document.querySelector(".product-list");

        products.forEach(product => {
            let productElement = document.createElement("div");
            productElement.classList.add("product");

            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="80">
                <h3>${product.name}</h3>
                <p>Prezzo: €${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Aggiungi al carrello</button>
            `;

            productContainer.appendChild(productElement);
        });

        // Aggiungere eventi ai bottoni "Aggiungi al carrello"
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (e) => {
                let id = e.target.dataset.id;
                let name = e.target.dataset.name;
                let price = parseFloat(e.target.dataset.price);
                let image = e.target.dataset.image;

                addToCart({ id, name, price, image });
            });
        });
    }

    // 🛒 Aggiungere un prodotto al carrello
    function addToCart(product) {
        let existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        updateCart();
    }

    // 🗑️ Rimuovere un prodotto dal carrello
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // 🔄 Aggiornare il carrello
    function updateCart() {
        cartContainer.innerHTML = ""; // Pulire il carrello
        let total = 0;

        cart.forEach(product => {
            total += product.price * product.quantity;

            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="50">
                <div class="item-info">
                    <h2>${product.name}</h2>
                    <p>Prezzo: €${product.price.toFixed(2)}</p>
                    <p>Quantità: ${product.quantity}</p>
                </div>
                <button class="remove" data-id="${product.id}">Rimuovi</button>
            `;

            cartContainer.appendChild(cartItem);
        });

        totalContainer.textContent = `€${total.toFixed(2)}`;

        // Salva il carrello nel localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Assegna eventi ai bottoni "Rimuovi"
        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", (e) => {
                let id = e.target.dataset.id;
                removeFromCart(id);
            });
        });
    }

    // 🔥 Simulazione dell'acquisto
    checkoutButton.addEventListener("click", async () => {
        if (cart.length === 0) {
            alert("Il carrello è vuoto!");
            return;
        }

        try {
            let response = await fetch("http://localhost:8080/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cart)
            });

            let result = await response.json();
            alert(result.message);

            if (result.success) {
                cart = [];
                updateCart();
            }
        } catch (error) {
            console.error("Errore durante il checkout:", error);
        }
    });

    // 🚀 Caricare i prodotti dal database e il carrello salvato
    fetchProducts();
    updateCart();
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