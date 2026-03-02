/* ============================================
   UPDATED HEADER with hamburger & scroll class
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {

    /* ---- Load Header & Footer fragments ---- */
    fetch("/global/header.html")
        .then(r => r.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            initNav();
        });

    fetch("/global/footer.html")
        .then(r => r.text())
        .then(data => document.getElementById("footer").innerHTML = data);

    /* ---- Scroll handler: sticky header tint ---- */
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 40);
        }
    }, { passive: true });

    /* ---- Scroll Reveal ---- */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // stagger siblings
                const siblings = entry.target.parentElement
                    ? [...entry.target.parentElement.children].filter(c =>
                        c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right'))
                    : [];
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));

    /* ---- Leaf particles ---- */
    const leafContainer = document.querySelector('.leaf-container');
    if (leafContainer) {
        const leafImages = ['/home/assets/leaves1.png', '/home/assets/leaves2.png'];
        const totalLeaves = 18;
        for (let i = 0; i < totalLeaves; i++) {
            const leaf = document.createElement('img');
            leaf.src = leafImages[Math.floor(Math.random() * leafImages.length)];
            leaf.classList.add('leaf');
            // Random horizontal position
            leaf.style.left = `${Math.random() * 100}%`;
            // Random size
            const size = 30 + Math.random() * 50;
            leaf.style.width = `${size}px`;
            // Random duration and delay
            const dur = 18 + Math.random() * 22;
            const delay = -(Math.random() * dur); // start mid-flight
            leaf.style.animationDuration = `${dur}s`;
            leaf.style.animationDelay = `${delay}s`;
            leafContainer.appendChild(leaf);
        }
    }
});

/* ---- Hamburger nav init (called after header loads) ---- */
function initNav() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
        });
    });
}