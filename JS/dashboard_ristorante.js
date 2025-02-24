
function addMenuItem() {
    const category = document.getElementById("menuCategory").value;
    const menuItem = document.getElementById("menuItem").value.trim();
    const menuPrice = document.getElementById("menuPrice").value.trim();
    const menuImage = document.getElementById("menuImage").files[0];

    if (!menuItem || !menuPrice) {
        alert("Inserisci nome e prezzo del piatto!");
        return;
    }

    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";

    let imageTag = "";
    if (menuImage) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageTag = `<img src="${e.target.result}" class="img-thumbnail me-2" width="50" height="50">`;
            saveMenuItem(category, menuItem, menuPrice, e.target.result);
            updateListItem();
        };
        reader.readAsDataURL(menuImage);
    } else {
        saveMenuItem(category, menuItem, menuPrice, "");
        updateListItem();
    }

    function updateListItem() {
        listItem.innerHTML = `
            ${imageTag}
            <span>${menuItem} - €${menuPrice}</span>
            <button class="btn btn-danger btn-sm" onclick="removeMenuItem(this, '${category}', '${menuItem}')">X</button>
        `;
        document.getElementById(category).appendChild(listItem);
    }

    document.getElementById("menuItem").value = "";
    document.getElementById("menuPrice").value = "";
    document.getElementById("menuImage").value = "";
}

function removeMenuItem(button, category, itemName) {
    button.parentElement.remove();
    let menu = JSON.parse(localStorage.getItem("menu")) || {};
    menu[category] = menu[category].filter(item => item.name !== itemName);
    localStorage.setItem("menu", JSON.stringify(menu));
}

function saveMenuItem(category, name, price, image) {
    let menu = JSON.parse(localStorage.getItem("menu")) || {};
    if (!menu[category]) menu[category] = [];
    menu[category].push({ name, price, image });
    localStorage.setItem("menu", JSON.stringify(menu));
}

function loadMenu() {
    let menu = JSON.parse(localStorage.getItem("menu")) || {};
    for (let category in menu) {
        menu[category].forEach(item => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            const imageTag = item.image ? `<img src="${item.image}" class="img-thumbnail me-2" width="50" height="50">` : "";
            listItem.innerHTML = `
                ${imageTag}
                <span>${item.name} - €${item.price}</span>
                <button class="btn btn-danger btn-sm" onclick="removeMenuItem(this, '${category}', '${item.name}')">X</button>
            `;
            document.getElementById(category).appendChild(listItem);
        });
    }
}