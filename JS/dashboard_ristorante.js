const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
        datasets: [{
            label: 'Vendite (€)',
            data: [1200, 1350, 900, 1450, 1600, 2200, 1850],
            borderColor: 'blue',
            borderWidth: 2,
            fill: false
        }]
    }
});
function addMenuItem() {
    let item = document.getElementById('menuItem').value;
    let price = document.getElementById('menuPrice').value;
    if (item && price) {
        let list = document.getElementById('menuList');
        let li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `${item} - €${price} <button class='btn btn-danger btn-sm float-end' onclick='removeMenuItem(this)'>X</button>`;
        list.appendChild(li);
        document.getElementById('menuItem').value = '';
        document.getElementById('menuPrice').value = '';
    }
}
function removeMenuItem(button) {
    button.parentElement.remove();
}