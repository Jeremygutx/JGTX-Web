(() => {
    const init = () => {
        if (!window.gsap || !window.ScrollTrigger) return;

        gsap.registerPlugin(ScrollTrigger);

        // This Home now uses the single scroll-film controller.
        if (document.querySelector('#jgtxScrollFilm')) return;
        const root = document.querySelector('#jgtxCinematic');
        if (!root) return;

        const stage = root.querySelector('.cinematic-stage');
        const bg = root.querySelector('.cinematic-bg');
        const vignette = root.querySelector('.cinematic-vignette');
        const grid = root.querySelector('.cinematic-grid');
        const scenes = {
            one: root.querySelector('.scene-one'),
            two: root.querySelector('.scene-two'),
            three: root.querySelector('.scene-three'),
            four: root.querySelector('.scene-four'),
            five: root.querySelector('.scene-five')
        };
        const cards = gsap.utils.toArray('.cinematic-service-card', root);

        gsap.set([scenes.two, scenes.three, scenes.four, scenes.five], { autoAlpha: 0 });
        gsap.set(cards, { y: 45, autoAlpha: 0, scale: .94 });

        const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: '+=4300',
                pin: stage,
                scrub: 1.15,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        tl.to(bg, { scale: 1.12, xPercent: -2, yPercent: -2, duration: 2.0 }, 0)
          .to(grid, { opacity: .42, scale: 1.08, duration: 2.0 }, 0)
          .to(vignette, { backgroundColor: 'rgba(0,0,0,.08)', duration: 1.0 }, .1)
          .to(scenes.one, { yPercent: -20, autoAlpha: 0, duration: 1.0 }, .55)
          .fromTo(scenes.two, { yPercent: 18, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .8 }, .75)
          .to(scenes.two, { yPercent: -18, autoAlpha: 0, duration: .7 }, 1.55)
          .fromTo(scenes.three, { scale: .86, yPercent: 10, autoAlpha: 0 }, { scale: 1, yPercent: 0, autoAlpha: 1, duration: .9 }, 1.62)
          .to(bg, { scale: 1.26, xPercent: 3, yPercent: -5, filter: 'brightness(.72) saturate(1.18)', duration: 1.7 }, 1.65)
          .to(scenes.three, { scale: 1.08, autoAlpha: 0, duration: .75 }, 2.45)
          .fromTo(scenes.five, { scale: .82, yPercent: 16, autoAlpha: 0, filter: 'blur(12px)' }, { scale: 1, yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: .9 }, 2.55)
          .to(bg, { scale: 1.34, yPercent: -7, filter: 'brightness(.55) saturate(1.25)', duration: .9 }, 2.55)
          .to(scenes.five, { scale: 1.08, yPercent: -8, autoAlpha: 0, filter: 'blur(6px)', duration: .65 }, 3.45);

        // El showcase de servicios vive fuera del stage del Hero.
        // Su animación se controla en home-scroll-transitions.js para evitar
        // que dos ScrollTriggers manipulen los mismos elementos.
        window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
