(() => {
    'use strict';

    const boot = () => {
        const root = document.getElementById('jgtxScrollFilm');
        if (!root) return;

        const stage = root.querySelector('.jgtx-film-stage');
        const video = root.querySelector('#jgtxFilmVideo');
        const overlay = root.querySelector('.jgtx-film-overlay');
        const grid = root.querySelector('.jgtx-film-grid');
        const redline = root.querySelector('.jgtx-film-redline');

        const reducedMotion =
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const scenes = {
            hero: root.querySelector('.film-hero'),
            services: root.querySelector('.film-services'),
            process: root.querySelector('.film-process'),
            contact: root.querySelector('.film-contact')
        };

        const serviceCards = [...root.querySelectorAll('.film-service-card')];
        const processCards = [...root.querySelectorAll('.film-pro-cluster')];
        const contactElements = [...root.querySelectorAll('.film-contact-enter')];

        // Accesibilidad: sin movimiento, mostramos una versión estática.
        if (reducedMotion) {
            document.documentElement.classList.add('film-reduced-motion');
            root.classList.add('film-reduced-motion');
            if (video) {
                video.pause();
                video.muted = true;
                video.setAttribute('muted', '');
            }
            return;
        }

        const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
        const ease = v => {
            v = clamp(v);
            return v * v * (3 - 2 * v);
        };
        const sceneAlpha = (p, start, end) => {
            if (p < start || p > end) return 0;
            const span = end - start;
            const fade = Math.min(span * 0.20, 0.055);
            const enter = start === 0 ? 1 : ease(clamp((p - start) / fade));
            const leave = ease(clamp((end - p) / fade));
            return Math.min(enter, leave);
        };

        // Ventanas superpuestas para transiciones cinematográficas continuas.
        const windows = {
            hero: [0.00, 0.24],
            services: [0.16, 0.46],
            process: [0.38, 0.70],
            contact: [0.62, 1.00]
        };

        const allScenes = Object.values(scenes).filter(Boolean);
        allScenes.forEach(scene => {
            scene.style.opacity = '0';
            scene.style.visibility = 'hidden';
            scene.style.transform = 'translate3d(0, 70px, 0) scale(.94)';
            scene.style.filter = 'blur(7px)';
        });
        if (scenes.hero) {
            scenes.hero.style.opacity = '1';
            scenes.hero.style.visibility = 'visible';
            scenes.hero.style.transform = 'none';
            scenes.hero.style.filter = 'none';
        }

        serviceCards.forEach(card => card.style.transformOrigin = 'center center');
        processCards.forEach(card => card.style.transformOrigin = 'center center');
        contactElements.forEach(el => el.style.transformOrigin = 'center center');

        let smoothProgress = 0;
        let videoProgress = 0;
        let lastVideoTime = -1;
        let lastHeight = 0;

        const readProgress = () => {
            const maxScroll = Math.max(root.offsetHeight - window.innerHeight, 1);
            const absolute = window.scrollY - root.offsetTop;
            return clamp(absolute / maxScroll);
        };

        const applyScene = (scene, alpha, offset = 70) => {
            if (!scene) return;
            if (alpha <= 0.001) {
                scene.style.opacity = '0';
                scene.style.visibility = 'hidden';
                return;
            }
            scene.style.opacity = String(alpha);
            scene.style.visibility = 'visible';
            const lift = (1 - alpha) * offset;
            const scale = 0.94 + alpha * 0.06;
            const blur = (1 - alpha) * 7;
            scene.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
            scene.style.filter = `blur(${blur}px)`;
        };

        const update = () => {
            const target = readProgress();
            smoothProgress += (target - smoothProgress) * 0.14;
            if (Math.abs(target - smoothProgress) < 0.0005) smoothProgress = target;
            const p = smoothProgress;

            Object.entries(windows).forEach(([name, [start, end]]) => {
                applyScene(scenes[name], sceneAlpha(p, start, end));
            });

            // Salida de cámara / tipografía del hero.
            if (scenes.hero) {
                const hp = clamp(p / windows.hero[1]);
                const exit = ease(clamp((hp - 0.38) / 0.62));
                const eyebrow = scenes.hero.querySelector('.film-hero-eyebrow');
                const title = scenes.hero.querySelector('.film-hero-title');
                const sub = scenes.hero.querySelector('.film-hero-sub');
                const hint = scenes.hero.querySelector('.film-scroll-hint');
                if (eyebrow) eyebrow.style.transform = `translate3d(${-exit * 85}px, ${-exit * 25}px, 0)`;
                if (title) title.style.transform = `translate3d(0, ${-exit * 95}px, 0) scale(${1 - exit * .14})`;
                if (sub) sub.style.opacity = String(1 - exit);
                if (hint) hint.style.opacity = String(1 - exit);
            }

            // Cascade de tarjetas de servicio.
            const sp = clamp((p - windows.services[0]) / (windows.services[1] - windows.services[0]));
            serviceCards.forEach((card, i) => {
                const local = ease(clamp((sp - i * .055) / .58));
                card.style.opacity = String(local);
                card.style.transform = `perspective(1100px) translate3d(0, ${(1 - local) * 70}px, ${(1 - local) * -120}px) rotateX(${(1 - local) * 14}deg) scale(${.86 + local * .14})`;
            });

            // Cascade del proceso (clusters orbitales).
            const pp = clamp((p - windows.process[0]) / (windows.process[1] - windows.process[0]));
            processCards.forEach((card, i) => {
                const local = ease(clamp((pp - i * .06) / .7));
                card.style.opacity = String(local);
                card.style.transform = `translate3d(0, ${(1 - local) * 60}px, 0) scale(${.92 + local * .08})`;
            });

            // Cascade de contacto rápido.
            const cp = clamp((p - windows.contact[0]) / (windows.contact[1] - windows.contact[0]));
            contactElements.forEach((el, i) => {
                const local = ease(clamp((cp - i * .07) / .6));
                el.style.opacity = String(local);
                el.style.transform = `perspective(1000px) translate3d(0, ${(1 - local) * 50}px, 0) scale(${.92 + local * .08})`;
            });

            // Movimiento de fondo cinematográfico.
            if (video) {
                video.style.transform = `scale(${1.03 + p * .14}) translate3d(${p * -1.2}%, ${p * -1.5}%, 0)`;
            }
            if (grid) {
                grid.style.transform = `translate3d(${p * 42}px, ${-p * 55}px, 0) scale(${1 + p * .07})`;
                grid.style.opacity = String(.14 + p * .22);
            }
            if (overlay) {
                overlay.style.background = `radial-gradient(circle at ${62 + p * 24}% ${42 - p * 10}%, rgba(255,46,99,${.13 + p * .15}), transparent 36%), linear-gradient(90deg, rgba(0,0,0,${.84 - p * .12}), rgba(0,0,0,.25) 50%, rgba(0,0,0,.74))`;
            }
            if (redline) redline.style.transform = `scaleX(${p})`;

            // Scrub del video solo cuando la pestaña está visible.
            if (video && !document.hidden &&
                Number.isFinite(video.duration) && video.duration > 0) {
                videoProgress += (p - videoProgress) * 0.16;
                const desired = videoProgress * Math.max(video.duration - 0.05, 0);
                if (Math.abs(desired - lastVideoTime) > 0.035) {
                    try { video.currentTime = desired; lastVideoTime = desired; } catch (_) { }
                }
                if (!video.paused) {
                    try { video.pause(); } catch (_) { }
                }
            }

            const h = root.offsetHeight;
            if (h !== lastHeight) lastHeight = h;

            requestAnimationFrame(update);
        };

        if (video) {
            video.muted = true;
            video.setAttribute('muted', '');
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.pause();
            video.addEventListener('loadedmetadata', () => {
                try { video.currentTime = 0; } catch (_) { }
            });
        }

        document.documentElement.style.scrollBehavior = 'auto';
        window.dispatchEvent(new Event('resize'));
        requestAnimationFrame(update);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();