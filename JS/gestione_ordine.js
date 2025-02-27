// Carica gli ordini salvati quando la pagina è caricata
document.addEventListener("DOMContentLoaded", function (){
     loadOrders();
});

// Recupera gli ordini dal localStorage o inizializza un array vuoto se non esistono
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Funzione per aggiungere un ordine
function addOrder() {
        const orderName = document.getElementById("orderName").value; // Ottiene il nome dell'ordine
        const orderPrice = document.getElementById("orderPrice").value; // Ottiene il prezzo dell'ordine
        const orderStatus = "In attesa";  // Stato iniziale dell'ordine
    
        // Controlla che i campi nome e prezzo non siano vuoti
        if (orderName === "" || orderPrice === "") {
          alert("Inserisci nome e prezzo dell'ordine.");
          return;  
        }
    
        // Crea un nuovo oggetto ordine
        const order = {
            id: new Date().getItem(),
            name: orderName,
            price: parseFloat(orderPrice).toFixed(2),
            status: orderStatus
        };

        // Aggiunge l'ordine all'array e lo salva nel localStorage
        order.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        loadOrders();
}

// Funzione per caricare e visualizzare gli ordini
function loadOrders() {
    const orderList = document-getElementById("orderList");
    orderList.innerHTML = "";

       // Itera su ogni ordine e lo aggiunge alla lista
        orders.forEach(order => {
        const orderItem = document.createElement("li");
        orderItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center")
        orderItem.innerHTML = `
         <span class="badge bg-warning text-dark">${order.status}</span>
            <button class="btn btn-success btn-sm" onclick="updateOrder(${order.id})">Completa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})">Rimuovi</button>
        `;
        orderList.appendChild(orderItem);
    });
}

// Funzione per aggiornare lo stato di un ordine a "Completato"
function updateOrder(id) {
    orders = orders.map(order =>
        order.id === id ? { ...order, status:"Completato" } : order
    );
    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrders(); 
}

// Funzione per eliminare un ordine
function deleteOrder(id) {
    orders = orders = orders.filter(order => order.id !== id);
    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrders();
}
// Funzione per annullare un ordine
function cancelOrder(id) {
    orders = orders.map(order =>
        order.id === id ? { ...order, status: "Annullato"} : order
    );
    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrders();      
}