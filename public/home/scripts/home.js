/* ============================
   HOME PAGE — Carousel Script
   ============================ */
(function () {
    const images = document.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    let interval;

    function goTo(index) {
        images[currentIndex].classList.remove('active');
        dots[currentIndex]?.classList.remove('active');
        currentIndex = (index + images.length) % images.length;
        images[currentIndex].classList.add('active');
        dots[currentIndex]?.classList.add('active');
    }

    function next() { goTo(currentIndex + 1); }

    // Dot click navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(interval);
            goTo(i);
            interval = setInterval(next, 4000);
        });
    });

    // Auto-advance
    interval = setInterval(next, 4000);
})();
