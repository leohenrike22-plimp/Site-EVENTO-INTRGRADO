/*
  Script com carrossel de notificações e menu responsivo.
*/

(function () {
    'use strict';

    const LOG_PREFIX = '[EVENTO:script]';
    const NOTIFICATION_DURATION = 5000;
    const MAX_NOTIFICATIONS = 3;

    // Helpers
    const $id = (id) => document.getElementById(id) || null;

    // Sistema de notificações
    function createNotificationCarousel() {
        const carousel = document.createElement('div');
        carousel.className = 'notification-carousel';
        carousel.id = 'notification-carousel';
        document.body.appendChild(carousel);
        return carousel;
    }

    function createNotification(title, message, type = 'info', duration = NOTIFICATION_DURATION, imageSrc = null) {
        const carousel = $id('notification-carousel') || createNotificationCarousel();
        
        // Remove notificações antigas se exceder o limite
        const existingNotifications = carousel.querySelectorAll('.notification-item');
        if (existingNotifications.length >= MAX_NOTIFICATIONS) {
            hideNotification(existingNotifications[0]);
        }

        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        
        if (imageSrc) {
            notification.classList.add('has-image');
        }
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const imageHTML = imageSrc ? `<img src="${imageSrc}" alt="Imagem da notificação" class="notification-image">` : '';

        notification.innerHTML = `
            <div class="notification-header">
                <h4 class="notification-title">${title}</h4>
                <button class="notification-close" aria-label="Fechar notificação">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="notification-message">${message}</p>
            ${imageHTML}
            <div class="notification-time">${timeString}</div>
        `;

        carousel.appendChild(notification);

        // Mostrar com animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-hide após duração especificada
        if (duration > 0) {
            setTimeout(() => {
                hideNotification(notification);
            }, duration);
        }

        // Event listeners
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideNotification(notification);
        });

        notification.addEventListener('click', () => {
            hideNotification(notification);
        });

        return notification;
    }

    function hideNotification(notification) {
        if (!notification || notification.classList.contains('hide')) return;
        
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }

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

    // Exemplo de notificações para demonstração
    function showDemoNotifications() {
        setTimeout(() => {
            createNotification(
                'Bem-vindo!',
                'Confira as últimas novidades sobre o evento INOFAS & ENAGROTECH 2025.',
                'success'
            );
        }, 2000);

        setTimeout(() => {
            createNotification(
                'Aviso Importante',
                'Confira todas as informações sobre o evento.',
                'warning',
                4000,
                '/Site/images/aviso.jpeg '
            );
        }, 4000);
    }

    // API pública para criar notificações
    window.showNotification = function(title, message, type = 'info', duration = NOTIFICATION_DURATION, imageSrc = null) {
        return createNotification(title, message, type, duration, imageSrc);
    };

    // Inicialização
    function init() {
        console.info(`${LOG_PREFIX} script carregado`);
        setupMenu();
        showDemoNotifications();
    }

    window.addEventListener('load', init);

})();
