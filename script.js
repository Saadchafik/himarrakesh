// ── Language System ──────────────────────────────────────
let currentLang = localStorage.getItem('himt-lang') || 'en';

function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('himt-lang', lang);
    document.documentElement.lang = lang;

    // Flip label to the OTHER language (so it shows what you'd switch TO)
    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang === 'en' ? 'FR' : 'EN';

    // Translate all elements that carry data-en / data-fr
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (!text) return;
        // If element contains only text (no child elements worth preserving), set innerHTML
        // Otherwise set textContent to avoid XSS from data attributes
        if (el.children.length === 0) {
            el.textContent = text;
        } else {
            // For mixed elements (like btn with svg + span), only translate the span
            // This case is handled by placing data-* on the inner <span>, so nothing extra needed
        }
    });
}

function toggleLang() {
    applyLang(currentLang === 'en' ? 'fr' : 'en');
}

// ── Mobile menu ───────────────────────────────────────────
const menuToggleBtn = document.getElementById('menuToggleBtn');
const navLinks = document.getElementById('navLinks');

if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggleBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
}

document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggleBtn?.setAttribute('aria-expanded', 'false');
    });
});

// Close menu when clicking outside
document.addEventListener('click', e => {
    if (navLinks?.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggleBtn?.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggleBtn?.setAttribute('aria-expanded', 'false');
    }
});

// ── Smooth scroll ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
            const top = t.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Sliders ───────────────────────────────────────────────
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
    el.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; }, { passive: true });
    el.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - sx;
        const id = el.querySelector('.slider-container')?.id;
        if (!id) return;
        if (dx < -40) changeSlide(id, 1);
        if (dx > 40) changeSlide(id, -1);
    });
});

// ── WhatsApp booking ──────────────────────────────────────
function bookTour(name, price) {
    const phone = '212600000000';
    const isEn = currentLang === 'en';
    const msg = encodeURIComponent(isEn
        ? `Hello! I'd like to book:\n📍 ${name}\n💰 ${price}\n\nCan you help me?`
        : `Bonjour! Je voudrais réserver:\n📍 ${name}\n💰 ${price}\n\nPouvez-vous m'aider?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// ── Toggle tour program ───────────────────────────────────
function toggleProgram(btn) {
    const content = btn.nextElementSibling;
    const isActive = content.classList.contains('active');
    document.querySelectorAll('.tour-program-content.active').forEach(c => {
        if (c !== content) {
            c.classList.remove('active');
            c.previousElementSibling.classList.remove('active');
        }
    });
    content.classList.toggle('active');
    btn.classList.toggle('active');
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    applyLang(currentLang); // apply saved/default language on load
});
