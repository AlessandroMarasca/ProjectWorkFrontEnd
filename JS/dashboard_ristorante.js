// Funzione per aggiungere una nuova categoria (es. "Zuppe", "Pizza")
function addCategory() {
    let newCategory = document.getElementById("nuova").value.trim();
    let menuCategory = document.getElementById("menuCategory");
    let menuContainer = document.getElementById("menuContainer");

    if (newCategory === "") {
        alert("Inserisci un nome per la nuova categoria!");
        return;
    }

    // Verifica se la categoria esiste già
    for (let i = 0; i < menuCategory.options.length; i++) {
        if (menuCategory.options[i].value.toLowerCase() === newCategory.toLowerCase()) {
            alert("Questa categoria esiste già!");
            return;
        }
    }

    // Aggiunge la categoria nel select
    let option = document.createElement("option");
    option.value = newCategory.toLowerCase();
    option.textContent = newCategory;
    menuCategory.appendChild(option);

    // Crea la sezione della categoria nel menuContainer
    let categorySection = document.createElement("div");
    categorySection.id = newCategory.toLowerCase();
    categorySection.innerHTML = `
        <h5>${newCategory}</h5>
        <ul class="list-group"></ul>
    `;
    menuContainer.appendChild(categorySection);

    // Pulisce il campo input
    document.getElementById("nuova").value = "";
}


function removeCategory() {
    let menuCategory = document.getElementById("menuCategory");
    let selectedCategory = menuCategory.value;

    if (!selectedCategory) {
        alert("Seleziona una categoria da rimuovere!");
        return;
    }

    // Rimuove la categoria dal select
    for (let i = 0; i < menuCategory.options.length; i++) {
        if (menuCategory.options[i].value === selectedCategory) {
            menuCategory.remove(i);
            break;
        }
    }

    // Rimuove la categoria dal menuContainer
    let categorySection = document.getElementById(selectedCategory);
    if (categorySection) {
        categorySection.remove();
    }
}


// Funzione per rimuovere tutte le categorie
function clearCategories() {
    let menuCategory = document.getElementById("menuCategory");
    let menuContainer = document.getElementById("menuContainer");

    // Rimuove tutte le opzioni dal select
    while (menuCategory.options.length > 0) {
        menuCategory.remove(0);
    }

    // Svuota il contenitore del menu
    menuContainer.innerHTML = "";
}



// Funzione per aggiungere un piatto
function addMenuItem() {
    let category = document.getElementById("menuCategory").value;
    let name = document.getElementById("menuItem").value.trim();
    let price = document.getElementById("menuPrice").value.trim();
    let description = document.getElementById("menuDescrizione").value.trim();

    if (name === "" || price === "" || isNaN(price)) {
        alert("Inserisci un nome valido e un prezzo numerico!");
        return;
    }

    let categoryList = document.getElementById(category);
    if (!categoryList) {
        alert("Seleziona una categoria valida!");
        return;
    }

    // Creare un nuovo elemento lista per il piatto
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    listItem.innerHTML = `
        <span>
            <strong>${name}</strong> - €${parseFloat(price).toFixed(2)}
            <br><small>${description}</small>
        </span>
        <button class="btn btn-danger btn-sm" onclick="removeMenuItem(this)">❌</button>
    `;

    categoryList.appendChild(listItem);

    // Pulisce i campi input
    document.getElementById("menuItem").value = "";
    document.getElementById("menuPrice").value = "";
    document.getElementById("menuDescrizione").value = "";
}

// Funzione per rimuovere un piatto
function removeMenuItem(button) {
    button.parentElement.remove();
}
let currentDate = new Date();

function renderCalendar() {
    const calendarDays = document.getElementById("calendar-days");
    const calendarTitle = document.getElementById("calendar-title");
    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // Giorno della settimana del primo giorno
    const lastDate = new Date(year, month + 1, 0).getDate(); // Ultimo giorno del mese

    calendarTitle.textContent = currentDate.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

    // Riempie i giorni vuoti prima del 1° giorno del mese
    for (let i = 0; i < firstDay; i++) {
        let emptyDiv = document.createElement("div");
        calendarDays.appendChild(emptyDiv);
    }

    // Riempie i giorni del mese
    for (let day = 1; day <= lastDate; day++) {
        let dayDiv = document.createElement("div");
        dayDiv.textContent = day;
        dayDiv.classList.add("day");

        if (
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
        ) {
            dayDiv.classList.add("today");
        }

        dayDiv.onclick = () => alert(`Hai cliccato il ${day}/${month + 1}/${year}`);
        calendarDays.appendChild(dayDiv);
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

renderCalendar();