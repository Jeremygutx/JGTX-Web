(() => {
    const boot = () => {
        if (!window.gsap || !window.ScrollTrigger) {
            console.error('[JGTX] No se pudo iniciar el ScrollTrigger del Home.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const q = (selector, scope = document) => scope.querySelector(selector);
        const qa = (selector, scope = document) => gsap.utils.toArray(selector, scope);

        const services = q('[data-transition="services"]');
        const products = q('[data-transition="products"]');
        const promo = q('[data-transition="promo"]');

        // ---------------------------------------------------------
        // SERVICIOS
        // ---------------------------------------------------------
        if (services) {
            const layer = q('.section-transition-layer', services);
            const bridge = q('.section-transition-bridge', services);
            const flare = q('.section-transition-flare', services);
            const heading = q('.categories-heading-animated', services);
            const cards = qa('[data-service-showcase]', services);
            const button = q('.categories-view-all', services);
            const grid = q('.service-showcase-grid', services);

            gsap.set(layer, { autoAlpha: 1, clipPath: 'inset(0 0 100% 0)' });
            gsap.set(heading, { autoAlpha: 0, y: 120, scale: .84, filter: 'blur(14px)' });
            gsap.set(button, { autoAlpha: 0, x: 90 });
            gsap.set(grid, { y: 80, rotateX: 3 });
            gsap.set(cards, { autoAlpha: 0, y: 170, scale: .72, rotateX: 22, z: -220, filter: 'blur(9px)' });
            if (bridge) gsap.set(bridge, { autoAlpha: 1, scaleX: 0 });
            if (flare) gsap.set(flare, { autoAlpha: 0, scale: .4 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: services,
                    start: 'top 92%',
                    end: 'top 18%',
                    scrub: 1.15,
                    invalidateOnRefresh: true
                }
            });

            tl.to(layer, { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, duration: .22 }, 0)
              .to(bridge, { scaleX: 1, duration: .25, ease: 'power2.out' }, .02)
              .to(flare, { autoAlpha: 1, scale: 1.1, duration: .28 }, .03)
              .to(heading, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .58, ease: 'power4.out' }, .10)
              .to(button, { autoAlpha: 1, x: 0, duration: .35 }, .26)
              .to(grid, { y: 0, rotateX: 0, duration: .45 }, .22)
              .to(cards, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, z: 0, filter: 'blur(0px)', stagger: .08, duration: .62, ease: 'power4.out' }, .22)
              .to(flare, { autoAlpha: 0, scale: 1.45, duration: .28 }, .72)
              .to(bridge, { scaleX: 1.6, autoAlpha: 0, duration: .18 }, .76);

            cards.forEach(card => {
                const media = q('.category-media', card);
                if (media) {
                    gsap.to(media, {
                        yPercent: -10,
                        scale: 1.08,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: services,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.2
                        }
                    });
                }
            });
        }

        // ---------------------------------------------------------
        // PRODUCTOS
        // ---------------------------------------------------------
        if (products) {
            const layer = q('.section-transition-layer', products);
            const glow = q('.featured-transition-glow', products);
            const container = q('.featured-container', products);
            const heading = q('[data-featured-heading]', products);
            const cards = qa('[data-featured-grid] .product-card', products);
            const footer = q('[data-featured-footer]', products);

            gsap.set(layer, { autoAlpha: 1, clipPath: 'inset(0 0 100% 0)' });
            gsap.set(container, { y: 90, scale: .97 });
            gsap.set(heading, { autoAlpha: 0, y: 110, scale: .84, filter: 'blur(13px)' });
            gsap.set(cards, { autoAlpha: 0, y: 150, scale: .70, rotateY: 18, rotateX: 12, filter: 'blur(8px)' });
            gsap.set(footer, { autoAlpha: 0, y: 40 });
            if (glow) gsap.set(glow, { autoAlpha: 0, scaleX: .05 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: products,
                    start: 'top 92%',
                    end: 'top 15%',
                    scrub: 1.1,
                    invalidateOnRefresh: true
                }
            });

            tl.to(layer, { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, duration: .20 }, 0)
              .to(glow, { autoAlpha: 1, scaleX: 1, duration: .22 }, .02)
              .to(container, { y: 0, scale: 1, duration: .42 }, .05)
              .to(heading, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .56, ease: 'power4.out' }, .10)
              .to(cards, { autoAlpha: 1, y: 0, scale: 1, rotateY: 0, rotateX: 0, filter: 'blur(0px)', stagger: .12, duration: .62, ease: 'power4.out' }, .24)
              .to(footer, { autoAlpha: 1, y: 0, duration: .35 }, .76)
              .to(glow, { autoAlpha: 0, scaleX: 1.8, duration: .25 }, .70);

            cards.forEach(card => {
                const image = q('.product-image', card) || q('img', card);
                if (image) {
                    gsap.to(image, {
                        yPercent: -8,
                        scale: 1.04,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: products,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.1
                        }
                    });
                }
            });
        }

        // ---------------------------------------------------------
        // OFERTA
        // ---------------------------------------------------------
        if (promo) {
            const layer = q('.section-transition-layer', promo);
            const banner = q('.promo-banner', promo);
            const bg = q('.promo-background', promo);
            const content = qa('.promo-content > *', promo);
            const visual = q('.promo-visual', promo);
            const line = q('.promo-transition-line', promo);

            gsap.set(layer, { autoAlpha: 1, clipPath: 'inset(0 0 100% 0)' });
            gsap.set(banner, { autoAlpha: 0, y: 120, scale: .86, clipPath: 'inset(0 100% 0 0 round 22px)' });
            gsap.set(content, { autoAlpha: 0, x: -100, filter: 'blur(10px)' });
            gsap.set(visual, { autoAlpha: 0, x: 130, scale: .70, rotate: -5, filter: 'blur(9px)' });
            gsap.set(bg, { scale: 1.18 });
            if (line) gsap.set(line, { scaleX: 0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: promo,
                    start: 'top 94%',
                    end: 'top 12%',
                    scrub: 1.15,
                    invalidateOnRefresh: true
                }
            });

            tl.to(layer, { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, duration: .18 }, 0)
              .to(line, { scaleX: 1, duration: .22 }, .02)
              .to(banner, { autoAlpha: 1, y: 0, scale: 1, clipPath: 'inset(0 0% 0 0 round 22px)', duration: .62, ease: 'power4.out' }, .06)
              .to(content, { autoAlpha: 1, x: 0, filter: 'blur(0px)', stagger: .08, duration: .48, ease: 'power4.out' }, .24)
              .to(visual, { autoAlpha: 1, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)', duration: .58, ease: 'power4.out' }, .30)
              .to(bg, { scale: 1.02, duration: .72 }, .05)
              .to(line, { scaleX: 1.7, autoAlpha: 0, duration: .22 }, .72);

            gsap.to(bg, {
                xPercent: 4,
                yPercent: -7,
                ease: 'none',
                scrollTrigger: {
                    trigger: promo,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2
                }
            });
        }

        // Evita que el navegador se quede con un estado de animación viejo.
        const refresh = () => ScrollTrigger.refresh(true);
        window.addEventListener('load', refresh, { once: true });
        if (document.fonts?.ready) document.fonts.ready.then(refresh);
        setTimeout(refresh, 250);
        setTimeout(refresh, 1000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
