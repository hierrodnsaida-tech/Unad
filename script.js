document.addEventListener('DOMContentLoaded', () => {

    /*  IDIOMA  */
    const langBtns   = [document.getElementById('lang-switch'), document.getElementById('lang-switch-overlay')];
    const langTexts  = document.querySelectorAll('.lang-text');
    const welcomeBox = document.getElementById('welcome-message');
    const overlay    = document.getElementById('welcome-overlay');
    const closeBtn   = document.getElementById('close-welcome');
    let currentLang  = 'es';

    function updateGreeting() {
        const hour = new Date().getHours();
        let greeting = '';
        if (hour < 12)       greeting = currentLang === 'es' ? '¡Buenos días! Bienvenido'      : 'Good morning! Welcome';
        else if (hour < 18)  greeting = currentLang === 'es' ? '¡Buenas tardes! Explora el arte' : 'Good afternoon! Explore the art';
        else                 greeting = currentLang === 'es' ? '¡Buenas noches! Disfruta la galería' : 'Good evening! Enjoy the gallery';
        if (welcomeBox) welcomeBox.textContent = greeting;
    }

    function applyLang(lang) {
        langTexts.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.innerHTML = text;
        });
        langBtns.forEach(b => { if (b) b.textContent = lang === 'es' ? 'ES / EN' : 'EN / ES'; });
        document.documentElement.lang = lang;
        updateGreeting();
    }

    langBtns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', e => {
            e.stopPropagation();
            currentLang = currentLang === 'es' ? 'en' : 'es';
            applyLang(currentLang);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.add('welcome-hidden'));
    updateGreeting();


    /*  HERO SLIDER  */
    const track  = document.getElementById('sliderTrack');
    const slides = track ? Array.from(track.querySelectorAll('.slide')) : [];
    const dots   = Array.from(document.querySelectorAll('.dot'));
    const btnPrev = document.getElementById('sliderPrev');
    const btnNext = document.getElementById('sliderNext');

    if (track && slides.length) {
        let current   = 0;
        let autoTimer = null;

        function goTo(index) {
            slides[current].setAttribute('aria-hidden', 'true');
            dots[current].classList.remove('active');
            dots[current].setAttribute('aria-selected', 'false');

            current = (index + slides.length) % slides.length;

            track.style.transform = `translateX(-${current * 100}%)`;
            slides[current].setAttribute('aria-hidden', 'false');
            dots[current].classList.add('active');
            dots[current].setAttribute('aria-selected', 'true');
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => goTo(current + 1), 4500);
        }

        function stopAuto() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        btnPrev && btnPrev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
        btnNext && btnNext.addEventListener('click', () => { goTo(current + 1); startAuto(); });

        dots.forEach(dot => {
            dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); startAuto(); });
        });

        // Swipe táctil
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
        });

        // Pausa al pasar el cursor
        track.closest('.hero-slider').addEventListener('mouseenter', stopAuto);
        track.closest('.hero-slider').addEventListener('mouseleave', startAuto);

        startAuto();
    }


    /* FILTRO DINÁMICO DE GALERÍA  */
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');

    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Actualizar botón activo
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                galleryItems.forEach(item => {
                    const match = filter === 'all' || item.dataset.category === filter;
                    if (match) {
                        item.classList.remove('hidden', 'fade-out');
                    } else {
                        item.classList.add('fade-out');
                        setTimeout(() => item.classList.add('hidden'), 340);
                    }
                });
            });
        });
    }

});