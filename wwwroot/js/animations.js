(() => {
    // Legacy section animator intentionally disabled on the Home cinematic film.
    // The complete Home experience is driven by cinematic-scroll-film.js.
    const init = () => {
        if (document.querySelector('#jgtxScrollFilm')) return;
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
