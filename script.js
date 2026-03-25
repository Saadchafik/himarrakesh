// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
}
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('active'));
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior:'smooth' });
    });
});

// Sliders - All IDs including Ouzoud and Casablanca
const SLIDERS = [
    'slider-agafay', 'slider-ourika', 'slider-montgolfiere', 'slider-palmeraie',
    'slider-imlil', 'slider-essaouira', 'slider-ouarzazate', 'slider-merzouga',
    'slider-ouzoud', 'slider-casablanca', 'slider-buggy', 'slider-quad', 'slider-city'
];

const state = {};

function initSliders() {
    SLIDERS.forEach((id, idx) => {
        const container = document.getElementById(id);
        if (!container) return;
        const slides = container.querySelectorAll('.slide');
        state[id] = { current: 0, total: slides.length };
        buildDots(id, slides.length);
        goTo(id, 0);
        // Auto-advance staggered
        setTimeout(() => {
            state[id].auto = setInterval(() => goTo(id, state[id].current + 1), 4000);
        }, idx * 600);
    });
}

function buildDots(id, total) {
    const wrap = document.getElementById('dots-' + id);
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const d = document.createElement('span');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.onclick = () => goTo(id, i);
        wrap.appendChild(d);
    }
}

function goTo(id, idx) {
    const container = document.getElementById(id);
    if (!container) return;
    const slides = container.querySelectorAll('.slide');
    const dotsWrap = document.getElementById('dots-' + id);
    const dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
    const total = slides.length;
    idx = ((idx % total) + total) % total;
    state[id].current = idx;
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function changeSlide(id, dir) {
    if (state[id]?.auto) {
        clearInterval(state[id].auto);
        state[id].auto = setInterval(() => goTo(id, state[id].current + 1), 4000);
    }
    goTo(id, state[id].current + dir);
}

// Touch swipe
document.querySelectorAll('.tour-slider, .quick-slider').forEach(el => {
    let sx = 0;
    el.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; }, { passive:true });
    el.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - sx;
        const id = el.querySelector('.slider-container')?.id;
        if (!id) return;
        if (dx < -40) changeSlide(id, 1);
        if (dx > 40) changeSlide(id, -1);
    });
});

// WhatsApp booking
function bookTour(name, price) {
    const phone = '212600000000';
    const msg = encodeURIComponent(
        `Bonjour! Je voudrais réserver:\n📍 ${name}\n💰 ${price}\n\nPouvez-vous m'aider?\n\nHello! I'd like to book:\n📍 ${name}\n💰 ${price}\nCan you help?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// Toggle tour program
function toggleProgram(btn) {
    const content = btn.nextElementSibling;
    const isActive = content.classList.contains('active');
    
    // Close all other open programs
    document.querySelectorAll('.tour-program-content.active').forEach(c => {
        if (c !== content) {
            c.classList.remove('active');
            c.previousElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current program
    content.classList.toggle('active');
    btn.classList.toggle('active');
}

// Init
document.addEventListener('DOMContentLoaded', initSliders);