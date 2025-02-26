
document.addEventListener("DOMContentLoaded", function () {
    // Seleziona il canvas
    let ctx = document.getElementById("menuChart").getContext("2d");

    // Dati dinamici del menu (puoi caricarli da un'API)
    let menuData = {
        labels: ["Pizza", "Pasta", "Insalata", "Dolci", "Bevande"],
        datasets: [{
            label: "Numero di Ordini",
            data: [50, 30, 20, 40, 35], // Dati statici per ora, puoi renderli dinamici
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)"
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)"
            ],
            borderWidth: 1
        }]
    };

    // Creazione del grafico
    let menuChart = new Chart(ctx, {
        type: "bar",
        data: menuData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
fetch('/api/ordini')
    .then(response => response.json())
    .then(data => {
        menuChart.data.datasets[0].data = data.valori; // Supponiamo che l'API restituisca { valori: [70, 45, 33, 60, 50] }
        menuChart.update(); // Aggiorna il grafico con i nuovi dati
    })
    .catch(error => console.error("Errore nel caricamento dati:", error));
