document.addEventListener("DOMContentLoaded", function () {
    caricaCategorie(); // Carica le categorie all'avvio
    caricaMenu(); // Carica i piatti all'avvio
});

// ** Fetch per Caricare le Categorie dal Backend **
function caricaCategorie() {
    fetch("Http:localhost:8080/api/categorie")
        .then(response => response.json())
        .then(data => {
            let menuCategory = document.getElementById("menuCategory");
            menuCategory.innerHTML = ""; // Svuota il select

            data.forEach(categoria => {
                let option = document.createElement("option");
                option.value = categoria;
                option.textContent = categoria;
                menuCategory.appendChild(option);
            });
        })
        .catch(error => console.error("Errore nel caricamento delle categorie:", error));
}

// ** Fetch per Aggiungere una Categoria nel Backend **
function addCategory() {
    let newCategory = document.getElementById("nuova").value.trim();
    if (newCategory === "") {
        alert("Inserisci un nome per la nuova categoria!");
        return;
    }

    fetch("/api/categorie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria: newCategory })
    })
        .then(response => response.json())
        .then(() => {
            caricaCategorie(); // Ricarica il select
            document.getElementById("nuova").value = ""; // Pulisce il campo
        })
        .catch(error => console.error("Errore nell'aggiunta della categoria:", error));
}

// ** Fetch per Rimuovere una Categoria nel Backend **
function removeCategory() {
    let selectedCategory = document.getElementById("menuCategory").value;
    if (!selectedCategory) {
        alert("Seleziona una categoria da rimuovere!");
        return;
    }

    fetch(`/api/categorie/${selectedCategory}`, { method: "DELETE" })
        .then(response => response.json())
        .then(() => caricaCategorie()) // Ricarica il select
        .catch(error => console.error("Errore nella rimozione della categoria:", error));
}

// ** Fetch per Aggiungere un Piatto nel Backend **
function addMenuItem() {
    let category = document.getElementById("menuCategory").value;
    let name = document.getElementById("menuItem").value.trim();
    let price = document.getElementById("menuPrice").value.trim();
    let description = document.getElementById("menuDescrizione").value.trim();

    if (!category || name === "" || price === "" || isNaN(price)) {
        alert("Inserisci un nome valido e un prezzo numerico!");
        return;
    }

    fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria: category, nome: name, prezzo: parseFloat(price), descrizione: description })
    })
        .then(response => response.json())
        .then(() => {
            caricaMenu(); // Ricarica il menu
            document.getElementById("menuItem").value = "";
            document.getElementById("menuPrice").value = "";
            document.getElementById("menuDescrizione").value = "";
        })
        .catch(error => console.error("Errore nell'aggiunta del piatto:", error));
}

// ** Fetch per Caricare il Menu dal Backend **
function caricaMenu() {
    fetch("/api/menu")
        .then(response => response.json())
        .then(data => {
            let menuContainer = document.getElementById("menuContainer");
            menuContainer.innerHTML = ""; // Svuota il contenitore

            Object.keys(data).forEach(categoria => {
                let categorySection = document.createElement("div");
                categorySection.id = categoria;
                categorySection.innerHTML = `<h5>${categoria}</h5><ul class="list-group"></ul>`;

                data[categoria].forEach(piatto => {
                    let listItem = document.createElement("li");
                    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                    listItem.innerHTML = `
                        <span><strong>${piatto.nome}</strong> - €${piatto.prezzo.toFixed(2)}<br><small>${piatto.descrizione}</small></span>
                        <button class="btn btn-danger btn-sm" onclick="removeMenuItem('${categoria}', '${piatto.nome}', this)">❌</button>
                    `;
                    categorySection.querySelector("ul").appendChild(listItem);
                });

                menuContainer.appendChild(categorySection);
            });
        })
        .catch(error => console.error("Errore nel caricamento del menu:", error));
}

// ** Fetch per Rimuovere un Piatto nel Backend **
function removeMenuItem(categoria, nome, button) {
    fetch(`/api/menu/${categoria}/${nome}`, { method: "DELETE" })
        .then(response => response.json())
        .then(() => button.parentElement.remove()) // Rimuove dalla UI
        .catch(error => console.error("Errore nella rimozione del piatto:", error));
}
