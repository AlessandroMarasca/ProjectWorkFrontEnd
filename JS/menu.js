document.addEventListener("DOMContentLoaded", function () {

    const menuLink = document.querySelector("a[href='#gestioneMenu']");
    const dashboardTitle = document.querySelector(".dashboard");
    const gestioneMenuSection = document.getElementById("gestioneMenu");

    if (menuLink && dashboardTitle && gestioneMenuSection) {
        menuLink.addEventListener("click", function (event) {
            event.preventDefault();
            gestioneMenuSection.scrollIntoView({ behavior: "smooth" }); //
        });
    }
    const dashboardLink = document.querySelector("a[href='#']");
    if (dashboardLink && dashboardTitle) {
        dashboardLink.addEventListener("click", function (event) {
            event.preventDefault();
            dashboardTitle.scrollIntoView({ behavior: "smooth" });
        });
    }
});



/*legge i dati inseriti da dashboard e li mostra
document.addEventListener("DOMContentLoaded", function () {
    const menuData = JSON.parse(localStorage.getItem("menuData"));

    if (!menuData) return; // Se non ci sono dati, esci

    const categorieContainer = document.querySelector(".btn-group");
    const menuContainer = document.querySelector(".row.d-flex.all");

    // Creare i bottoni delle categorie
    menuData.categorie.forEach(categoria => {
        const button = document.createElement("a");
        button.classList.add("btn", "btn-custom");
        button.textContent = categoria;
        button.href = "#";
        button.onclick = function () {
            mostraPiatti(categoria);
        };
        categorieContainer.appendChild(button);
    });

    // Creare le card dei piatti
    function mostraPiatti(categoriaSelezionata) {
        menuContainer.innerHTML = ""; // Svuotiamo il contenuto precedente
        menuData.piatti.forEach(piatto => {
            if (piatto.categoria === categoriaSelezionata) {
                const card = `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${piatto.nome}</h5>
                                <p class="card-text">${piatto.prezzo}</p>
                            </div>
                        </div>
                    </div>
                `;
                menuContainer.innerHTML += card;
            }
        });
    }

    // Mostrare tutti i piatti inizialmente
    mostraPiatti(menuData.categorie[0]);
});*/
