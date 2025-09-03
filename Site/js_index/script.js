/*
  Script limpo: apenas menu responsivo e utilidades básicas.
*/

(function () {
    'use strict';

    const LOG_PREFIX = '[EVENTO:script]';

    // Helpers
    const $id = (id) => document.getElementById(id) || null;

    // Menu responsivo
    function setupMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', function () {
                navLinks.classList.toggle('active');
            });
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    // Inicialização
    function init() {
        console.info(`${LOG_PREFIX} script carregado`);
        setupMenu();
    }

    window.addEventListener('load', init);

})();
