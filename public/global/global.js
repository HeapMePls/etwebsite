document.addEventListener("DOMContentLoaded", function () {
    fetch("/global/header.html")
        .then(response => response.text())
        .then(data => document.getElementById("header").innerHTML = data);

    fetch("/global/footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data);
    
});

const leafContainer = document.querySelector('.leaf-container');
        const totalLeaves = 30;
        const leafImages = [
          '/home/assets/leaves1.png',
          '/home/assets/leaves2.png'
        ];
    
        for (let i = 0; i < totalLeaves; i++) {
          const leaf = document.createElement('img');
          leaf.src = leafImages[Math.floor(Math.random() * leafImages.length)];
          leaf.classList.add('leaf');
    
          leaf.style.top = `${Math.random() * 100}%`;
          leaf.style.left = `${Math.random() * 100}%`;
          leaf.style.animationDelay = `${Math.random() * 20}s`;
          leaf.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
    
          leafContainer.appendChild(leaf);
        }