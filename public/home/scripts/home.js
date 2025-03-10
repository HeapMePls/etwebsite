
const images = document.querySelectorAll('.carousel-image');
let currentIndex = 0;

function changeImage() {
    images[currentIndex].classList.remove('active');

    currentIndex = (currentIndex + 1) % images.length;

    images[currentIndex].classList.add('active');
}

setInterval(changeImage, 3000);
