// Get all the images in the carousel
const images = document.querySelectorAll('.carousel-image');
let currentIndex = 0;

// Function to change the active image
function changeImage() {
    // Remove the 'active' class from the current image
    images[currentIndex].classList.remove('active');

    // Move to the next image (loop back to the start if we reach the end)
    currentIndex = (currentIndex + 1) % images.length;

    // Add 'active' class to the new image
    images[currentIndex].classList.add('active');
}

// Change image every 5 seconds (5000ms)
setInterval(changeImage, 3000);
