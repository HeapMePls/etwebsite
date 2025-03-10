document.addEventListener("DOMContentLoaded", function () {
    fetch("/global/header.html")
        .then(response => response.text())
        .then(data => document.getElementById("header").innerHTML = data);

    fetch("/global/footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data);
    
});