document.addEventListener("DOMContentLoaded", function () {
    loadOrders();
});

// Funzione per caricare gli ordini dal server
function loadOrders() {
    fetch("http://localhost:8080/orders")
        .then(response => response.json())
        .then(data => {
            const orderList = document.getElementById("orderList");
            orderList.innerHTML = "";
            data.forEach(order => {
                const orderItem = document.createElement("li");
                orderItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                orderItem.innerHTML = `
                    <span>${order.name} - €${order.price} - <span class="badge bg-warning text-dark">${order.status}</span></span>
                    <button class="btn btn-success btn-sm" onclick="updateOrder(${order.id})">Completa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id})">Rimuovi</button>
                `;
                orderList.appendChild(orderItem);
            });
        })
        .catch(error => console.error("Errore nel recupero ordini:", error));
}

// Funzione per aggiungere un ordine
function addOrder() {
    const orderName = document.getElementById("orderName").value;
    const orderPrice = document.getElementById("orderPrice").value;

    if (orderName === "" || orderPrice === "") {
        alert("Inserisci nome e prezzo dell'ordine.");
        return;
    }

    fetch("http://localhost:8080/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orderName, price: parseFloat(orderPrice).toFixed(2) })
    })
    .then(response => response.json())
    .then(() => {
        loadOrders();
        document.getElementById("orderName").value = "";
        document.getElementById("orderPrice").value = "";
    })
    .catch(error => console.error("Errore nell'aggiunta dell'ordine:", error));
}

// Funzione per aggiornare lo stato di un ordine
function updateOrder(id) {
    fetch(`http://localhost:8080/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completato" })
    })
    .then(() => loadOrders())
    .catch(error => console.error("Errore nell'aggiornamento dell'ordine:", error));
}

// Funzione per eliminare un ordine
function deleteOrder(id) {
    fetch(`http://localhost:8080/orders/${id}`, { method: "DELETE" })
    .then(() => loadOrders())
    .catch(error => console.error("Errore nella rimozione dell'ordine:", error));
}
// Funzione per annullare un ordine
function cancelOrder(id) {
    fetch(`http://localhost:8080/orders/cancel/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    })
    .then(() => loadOrders())
    .catch(error => console.error("Errore nell'annullamento dell'ordine:", error));
}
