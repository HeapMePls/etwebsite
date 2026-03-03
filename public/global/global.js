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

    /* ---- Leaf particles — injected inside each section ---- */
    const leafPaths = [
        // elongated leaf
        'M0,40 C10,-10 40,-10 40,0 C40,50 10,80 0,80 C-10,80 -10,50 0,40Z M0,40 L0,80',
        // rounder leaf
        'M0,35 C15,-15 45,-5 40,10 C35,50 15,75 0,75 C-15,75 -15,50 0,35Z',
        // asymmetric leaf
        'M0,30 C20,-15 50,0 45,15 C40,55 18,72 0,70 C-12,68 -8,45 0,30Z',
    ];
    // Two palettes: light-on-dark for green sections, dark-on-light for pale sections
    const darkBgColors = ['rgba(255,255,255,0.22)', 'rgba(220,195,140,0.28)', 'rgba(180,220,180,0.22)', 'rgba(200,169,110,0.30)'];
    const lightBgColors = ['rgba(44,95,46,0.20)', 'rgba(61,122,64,0.18)', 'rgba(26,61,28,0.22)', 'rgba(160,124,69,0.18)'];

    const sectionConfig = [
        { selector: '.hero-section', count: 7, palette: darkBgColors },
        { selector: '.needs-section', count: 5, palette: lightBgColors },
        { selector: '.about-section', count: 6, palette: darkBgColors },
        { selector: '.services-section', count: 5, palette: lightBgColors },
        { selector: '.cta-section', count: 5, palette: darkBgColors },
    ];

    sectionConfig.forEach(({ selector, count, palette }) => {
        const section = document.querySelector(selector);
        if (!section) return;

        // Insert the leaf layer as the FIRST child so content sits above it in the DOM
        const layer = document.createElement('div');
        layer.className = 'section-leaf-layer';
        section.insertBefore(layer, section.firstChild);

        for (let i = 0; i < count; i++) {
            const size = 36 + Math.random() * 54;
            const path = leafPaths[Math.floor(Math.random() * leafPaths.length)];
            const color = palette[Math.floor(Math.random() * palette.length)];

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '-15 -20 75 110');
            svg.classList.add('section-leaf');

            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', path);
            pathEl.setAttribute('fill', color);
            pathEl.setAttribute('stroke', color.replace(/[\d.]+\)$/, '0.5)'));
            pathEl.setAttribute('stroke-width', '1');
            svg.appendChild(pathEl);

            svg.style.left = `${5 + Math.random() * 90}%`;
            svg.style.width = `${size}px`;
            svg.style.height = 'auto';

            const dur = 14 + Math.random() * 18;
            const delay = -(Math.random() * dur);
            svg.style.animationDuration = `${dur}s`;
            svg.style.animationDelay = `${delay}s`;

            layer.appendChild(svg);
        }
    });
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