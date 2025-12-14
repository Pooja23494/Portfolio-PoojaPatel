// Typing effect
(function () {
    const el = document.getElementById('typed');
    const phrases = ['Front‑End Developer', 'UI Animator', 'Performance‑Focused Dev'];
    let idx = 0, char = 0, forward = true;

    function tick() {
        const word = phrases[idx];
        if (forward) {
            char++;
            if (char === word.length) { forward = false; setTimeout(tick, 900); return; }
        } else {
            char--;
            if (char === 0) { forward = true; idx = (idx + 1) % phrases.length; setTimeout(tick, 300); return; }
        }
        el.textContent = word.slice(0, char);
        setTimeout(tick, forward ? 60 : 30);
    }
    tick();
})();

// Reveal sections & highlight nav
(function () {
    const reveals = document.querySelectorAll('[data-reveal]');
    const navLinks = document.querySelectorAll('nav .nav-link');
    const sections = Array.from(document.querySelectorAll('main section[id]'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in-view'); }
        });
    }, { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));

    const navIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.6 });
    sections.forEach(s => navIo.observe(s));

    document.querySelectorAll('.nav-link').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();

// Skill Progress Animation on Scroll
(function () {
    const skillSection = document.getElementById('skills-resume');
    const bars = document.querySelectorAll('.skill-bar');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;

                bars.forEach((bar, index) => {
                    const value = bar.getAttribute('data-progress');

                    setTimeout(() => {
                        bar.style.width = value + '%';
                        bar.style.transition = 'width 1.2s ease';
                    }, index * 150);
                });
            }
        });
    }, { threshold: 0.4 });

    observer.observe(skillSection);
})();

// Contact Form Demo
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    msg.textContent = 'Thanks! Message sent.';
    this.reset();
    setTimeout(() => msg.textContent = '', 4000);
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.scrollY > 300 ? '1' : '0';
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Light/Dark Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

const track = document.getElementById('carousel-track');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let items = Array.from(track.children);
let slideWidth;
let index;
let autoSlide;

function visibleSlides() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
}

function setupClones() {
    const count = visibleSlides();

    // Remove old clones
    document.querySelectorAll('.clone').forEach(clone => clone.remove());

    items = Array.from(track.children);

    // Clone last slides → prepend
    items.slice(-count).forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        track.prepend(clone);
    });

    // Clone first slides → append
    items.slice(0, count).forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
    });

    items = Array.from(track.children);
}

function updateSizes() {
    slideWidth = items[0].offsetWidth + 24;
}

function move(animate = true) {
    track.style.transition = animate ? 'transform 0.7s ease-in-out' : 'none';
    track.style.transform = `translateX(-${index * slideWidth}px)`;

    items.forEach(el => el.classList.remove('slide-in'));
    for (let i = 0; i < visibleSlides(); i++) {
        items[index + i]?.classList.add('slide-in');
    }
}

function nextSlide() {
    index++;
    move();

    if (index >= items.length - visibleSlides()) {
        setTimeout(() => {
            index = visibleSlides();
            move(false);
        }, 700);
    }
}

function prevSlide() {
    index--;
    move();

    if (index < visibleSlides()) {
        setTimeout(() => {
            index = items.length - visibleSlides() * 2;
            move(false);
        }, 700);
    }
}

function startAuto() {
    autoSlide = setInterval(nextSlide, 3500);
}

function stopAuto() {
    clearInterval(autoSlide);
}

function init() {
    setupClones();
    updateSizes();

    index = visibleSlides();
    move(false);
    startAuto();
}

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

track.addEventListener('mouseenter', stopAuto);
track.addEventListener('mouseleave', startAuto);

window.addEventListener('resize', () => {
    stopAuto();
    init();
});

init();