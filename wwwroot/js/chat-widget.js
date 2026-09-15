(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {

        const root = document.createElement('div');
        root.innerHTML =
            '<button class="jgtx-chat-launcher" type="button" aria-label="Abrir agente virtual">' +
            '<i class="fa-solid fa-comment-dots jgtx-chat-open-icon"></i>' +
            '<i class="fa-solid fa-xmark jgtx-chat-close-icon"></i>' +
            '</button>' +

            '<div class="jgtx-chat-panel" role="dialog" aria-label="Agente virtual JGTX">' +
            '<div class="jgtx-chat-header">' +
            '<span class="jgtx-chat-avatar"><i class="fa-solid fa-robot"></i></span>' +
            '<div class="jgtx-chat-header-titles">' +
            '<strong>JGTX AGENTE</strong>' +
            '<span><b></b>En línea · responde al instante</span>' +
            '</div>' +
            '<button class="jgtx-chat-reset" type="button" title="Reiniciar conversación" aria-label="Reiniciar conversación"><i class="fa-solid fa-rotate-left"></i></button>' +
            '</div>' +
            '<div class="jgtx-chat-messages"></div>' +
            '<div class="jgtx-chat-quick"></div>' +
            '<div class="jgtx-chat-input">' +
            '<textarea rows="1" placeholder="Escribe tu consulta..." maxlength="500" aria-label="Escribe tu consulta"></textarea>' +
            '<button class="jgtx-chat-send" type="button" aria-label="Enviar mensaje"><i class="fa-solid fa-arrow-up"></i><i class="fa-solid fa-paper-plane"></i></button>' +
            '</div>' +
            '</div>';

        document.body.appendChild(root);

        const launcher = root.querySelector('.jgtx-chat-launcher');
        const panel = root.querySelector('.jgtx-chat-panel');
        const messages = root.querySelector('.jgtx-chat-messages');
        const quick = root.querySelector('.jgtx-chat-quick');
        const input = root.querySelector('.jgtx-chat-input textarea');
        const sendBtn = root.querySelector('.jgtx-chat-send');
        const resetBtn = root.querySelector('.jgtx-chat-reset');

        const greeting =
            'Hola, soy el agente virtual de JGTX Tech. Puedo ayudarte con los servicios, ' +
            'el proceso de trabajo, tiempos y formas de contacto. Pregúntame lo que necesites.';

        const starterChips = [
            '¿Qué servicios ofrecen?',
            '¿Cuánto cuesta un proyecto?',
            '¿Cómo es el proceso de trabajo?',
            'Formas de contacto'
        ];

        let busy = false;

        function escapeHtml(value) {
            const div = document.createElement('div');
            div.textContent = value;
            return div.innerHTML;
        }

        function linkify(text) {
            return text
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/(https?:\/\/[^\s]+)/g,
                    (match, url) => externalButton(url))
                .replace(/(^|\s)(\/[a-zA-Z][a-zA-Z0-9\/\-_]*)/g,
                    (match, pre, path) => pre + internalButton(path));
        }

        function externalButton(url) {
            const labels = {
                wa: 'Escribir por WhatsApp',
                ig: 'Ver Instagram',
                tk: 'Ver TikTok'
            };
            const network =
                url.indexOf('wa.me') > -1 ? 'wa' :
                url.indexOf('instagram.com') > -1 ? 'ig' :
                url.indexOf('tiktok.com') > -1 ? 'tk' : '';

            if (!network) {
                return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="jgtx-chat-link">' + url + '</a>';
            }

            return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="jgtx-chat-btn ' + network + '">' + labels[network] + '</a>';
        }

        function internalButton(path) {
            const labels = {
                '/Services': 'Ver servicios',
                '/Projects': 'Ver proyectos',
                '/Home/Contact': 'Ir al formulario'
            };
            const label = labels[path] || path.replace(/^\//, '');
            return '<a href="' + window.location.origin + path + '" class="jgtx-chat-btn">' + label + '</a>';
        }

        function renderText(text) {
            const escaped = linkify(escapeHtml(text));
            const lines = escaped.split('\n');

            let html = '';
            let inList = false;

            function closeList() {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
            }

            lines.forEach(function (raw) {
                if (!raw.trim()) {
                    closeList();
                    html += '<div class="jgtx-chat-space"></div>';
                    return;
                }

                if (/^\s*-\s+/.test(raw)) {
                    if (!inList) {
                        html += '<ul class="jgtx-chat-list">';
                        inList = true;
                    }
                    html += '<li>' + raw.replace(/^\s*-\s+/, '') + '</li>';
                    return;
                }

                closeList();
                html += raw + '<br>';
            });

            closeList();
            return html;
        }

        function addMessage(text, who) {
            const div = document.createElement('div');
            div.className = 'jgtx-chat-msg ' + who;
            div.innerHTML = renderText(text);
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function addUserMessage(text) {
            addMessage(text, 'user');
        }

        function addBotMessage(text) {
            addMessage(text, 'bot');
        }

        function renderChips(chips) {
            quick.innerHTML = '';
            chips.forEach(function (chip) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = chip;
                btn.addEventListener('click', function () {
                    send(chip);
                });
                quick.appendChild(btn);
            });
        }

        function showTyping() {
            const div = document.createElement('div');
            div.className = 'jgtx-chat-typing';
            div.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            return div;
        }

        function open() {
            panel.classList.add('open');
            launcher.classList.add('open');
            input.focus();
        }

        function close() {
            panel.classList.remove('open');
            launcher.classList.remove('open');
        }

        function send(text) {
            const message = (text || input.value).trim();

            if (!message || busy) {
                return;
            }

            if (message.length > 500) {
                addBotMessage('Tu consulta es muy larga (máximo 500 caracteres). Resúmela un poco y vuelve a intentarlo.');
                return;
            }

            busy = true;
            quick.innerHTML = '';
            input.value = '';
            input.style.height = '';
            sendBtn.classList.add('busy');
            sendBtn.disabled = true;
            addUserMessage(message);

            const typing = showTyping();

            fetch('/Chat/Ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    typing.remove();
                    addBotMessage(data.ok ? data.text : (data.text || 'No pude responder ahora. Inténtalo de nuevo.'));
                    if (Array.isArray(data.suggestions) && data.suggestions.length) {
                        renderChips(data.suggestions);
                    }
                })
                .catch(function () {
                    typing.remove();
                    addBotMessage('Ocurrió un error al conectarme. Revisa tu conexión e inténtalo nuevamente.');
                })
                .finally(function () {
                    busy = false;
                    sendBtn.classList.remove('busy');
                    sendBtn.disabled = false;
                    input.focus();
                });
        }

        launcher.addEventListener('click', function () {
            if (panel.classList.contains('open')) {
                close();
            } else {
                open();
                if (!messages.children.length) {
                    addBotMessage(greeting);
                    renderChips(starterChips);
                }
            }
        });

        resetBtn.addEventListener('click', function () {
            messages.innerHTML = '';
            quick.innerHTML = '';
            addBotMessage(greeting);
            renderChips(starterChips);
            input.value = '';
            input.style.height = '';
        });

        sendBtn.addEventListener('click', function () {
            send();
        });

        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send();
            }
        });

        input.addEventListener('input', function () {
            input.style.height = '';
            input.style.height = Math.min(input.scrollHeight, 90) + 'px';
        });

        const sessionKey = 'jgtxChatGreeted';
        if (!window.sessionStorage.getItem(sessionKey)) {
            window.sessionStorage.setItem(sessionKey, '1');
            window.setTimeout(function () {
                if (!panel.classList.contains('open') && !messages.children.length) {
                    open();
                    addBotMessage(greeting);
                    renderChips(starterChips);
                }
            }, 1600);
        }
    });
})();