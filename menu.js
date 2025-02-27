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