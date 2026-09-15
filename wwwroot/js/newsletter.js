(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {

        const forms = document.querySelectorAll('#newsletterForm');

        if (forms.length === 0) return;

        forms.forEach(form => {

            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button[type="submit"]');

            form.addEventListener('submit', async (event) => {

                event.preventDefault();

                if (!input || !input.value.trim()) {

                    if (typeof showToast === 'function') {
                        showToast('Escribe tu correo para suscribirte.');
                    }

                    return;
                }

                if (button) {
                    button.disabled = true;
                }

                try {

                    const token = form.querySelector(
                        'input[name="__RequestVerificationToken"]'
                    )?.value || '';

                    const response = await fetch('/Newsletter/Subscribe', {

                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'RequestVerificationToken': token
                        },
                        body: new URLSearchParams({ email: input.value.trim() })

                    });

                    const data = await response.json();

                    if (typeof showToast === 'function') {

                        showToast(data.message || (
                            data.ok
                                ? '¡Suscripción exitosa!'
                                : 'No se pudo completar la suscripción.'
                        ));

                    }

                    if (data.ok) {
                        form.reset();
                    }

                } catch (_) {

                    if (typeof showToast === 'function') {
                        showToast('Ocurrió un error. Inténtalo nuevamente.');
                    }

                } finally {

                    if (button) {
                        button.disabled = false;
                    }

                }

            });

        });

    });

})();