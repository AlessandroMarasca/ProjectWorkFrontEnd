
document.addEventListener("DOMContentLoaded", function () {
    let canvas = document.getElementById("menuChart");

    if (!canvas) {
        console.error("Errore: Canvas 'menuChart' non trovato!");
        return;
    }

    let ctx = canvas.getContext("2d");

    // Creiamo un grafico vuoto (senza dati iniziali)
    let menuChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [], // Vuoto all'inizio, verrà riempito con i nomi dei piatti
            datasets: [{
                label: "Numero di Ordini",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // colori casuali
    function generaColoreCasuale() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    // aggiornare grafico
    function aggiornaGrafico() {
        fetch("/api/ordini") // 
            .then(response => response.json())
            .then(data => {
                console.log("Dati aggiornati:", data);

                let piatti = Object.keys(data); // piatti
                let ordini = Object.values(data); // ordinati

                // colori casuali per ogni piatto
                let coloriSfondo = piatti.map(() => generaColoreCasuale());
                let coloriBordo = coloriSfondo.map(colore => colore.replace("0.6", "1"));

                // Aggiornare il grafico
                menuChart.data.labels = piatti;
                menuChart.data.datasets[0].data = ordini;
                menuChart.data.datasets[0].backgroundColor = coloriSfondo;
                menuChart.data.datasets[0].borderColor = coloriBordo;

                menuChart.update(); // Aggiorna il grafico con i nuovi dati
            })
            .catch(error => console.error("Errore nel recupero dei dati:", error));
    }

    // Esegui l'aggiornamento ogni 60 secondi
    setInterval(aggiornaGrafico, 60000);
});
