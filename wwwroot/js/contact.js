(function () {
    'use strict';

    document.addEventListener("DOMContentLoaded", () => {

        const form = document.getElementById("contactForm");

        if (!form) {
            return;
        }

        form.addEventListener("submit", async (event) => {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const lastname =
                document.getElementById("lastname").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const subject =
                document.getElementById("subject").value.trim();

            const message =
                document.getElementById("message").value.trim();

            // ============================
            // VALIDACIÓN
            // ============================

            if (
                !name ||
                !lastname ||
                !email ||
                !subject ||
                !message
            ) {

                if (typeof showToast === "function") {

                    showToast(
                        "Completa todos los campos obligatorios"
                    );

                }

                return;
            }

            const submitButton =
                form.querySelector("button[type='submit']");

            if (submitButton) {
                submitButton.disabled = true;
            }

            try {

                const token = form.querySelector(
                    'input[name="__RequestVerificationToken"]'
                )?.value || '';

                const body = new FormData();
                body.append("name", name);
                body.append("lastname", lastname);
                body.append("email", email);
                body.append("phone", phone);
                body.append("subject", subject);
                body.append("message", message);

                const response = await fetch(
                    "/Home/ContactSubmit",
                    {
                        method: "POST",
                        headers: {
                            "RequestVerificationToken": token
                        },
                        body
                    }
                );

                const data = await response.json();

                if (typeof showToast === "function") {

                    showToast(
                        data.message || "Tu mensaje fue enviado."
                    );

                }

                if (data.ok) {
                    form.reset();
                }

            } catch (_) {

                if (typeof showToast === "function") {

                    showToast(
                        "Ocurrió un error al enviar. Inténtalo nuevamente."
                    );

                }

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;
                }

            }

        });

    });

})();