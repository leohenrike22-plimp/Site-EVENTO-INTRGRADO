/*
  Script com carrossel de notificações e menu responsivo.
  
  IMPORTANTE: window.open() sem interação direta do usuário pode ser bloqueado por navegadores.
  Por isso, a abertura de nova aba ocorre apenas mediante click do usuário.
*/

(function () {
    'use strict';

    const LOG_PREFIX = '[EVENTO:script]';
    const NOTIFICATION_DURATION = 5000;
    const SEMANACT_NOTIFICATION_DURATION = 6000; // Tempo estendido para notificação da Semana CT
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

    function createNotification(title, message, type = 'info', duration = NOTIFICATION_DURATION, imageSrc = null, clickUrl = null) {
        const carousel = $id('notification-carousel') || createNotificationCarousel();
        
        // Remove notificações antigas se exceder o limite
        const existingNotifications = carousel.querySelectorAll('.notification-item');
        if (existingNotifications.length >= MAX_NOTIFICATIONS) {
            hideNotification(existingNotifications[0]);
        }

        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        
        // Adiciona classe especial se tiver URL para click
        if (clickUrl) {
            notification.classList.add('clickable-notification');
        }
        
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

        // Auto-hide após duração especificada (tempo estendido para Semana CT)
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

        // Se tem URL, adiciona comportamento de click para abrir nova aba
        if (clickUrl) {
            notification.addEventListener('click', (e) => {
                // Previne que o click no botão fechar ative este evento
                if (!e.target.closest('.notification-close')) {
                    // Abre nova aba - funciona porque é ação direta do usuário
                    window.open(clickUrl, '_blank', 'noopener,noreferrer');
                    hideNotification(notification);
                }
            });
            
            // Adiciona cursor pointer para indicar que é clicável
            notification.style.cursor = 'pointer';
        } else {
            // Comportamento original para notificações sem URL
            notification.addEventListener('click', () => {
                hideNotification(notification);
            });
        }

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

    // Função para criar notificação especial da Semana CT
    function showSemanactNotification() {
        createNotification(
            'Semana Nacional de Ciência e Tecnologia',
            'Clique aqui para conferir a programação completa',
            'info',
            SEMANACT_NOTIFICATION_DURATION, // Duração estendida para 6 segundos
            null,
            'https://semanact.mcti.gov.br/' // URL para abrir em nova aba
        );
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

        // Adiciona a notificação especial da Semana CT após 6 segundos
        setTimeout(() => {
            showSemanactNotification();
        }, 6000);
    }

    // API pública para criar notificações (mantém compatibilidade)
    window.showNotification = function(title, message, type = 'info', duration = NOTIFICATION_DURATION, imageSrc = null) {
        return createNotification(title, message, type, duration, imageSrc);
    };

    // API pública para criar notificação com URL clicável
    window.showClickableNotification = function(title, message, url, type = 'info', duration = NOTIFICATION_DURATION, imageSrc = null) {
        return createNotification(title, message, type, duration, imageSrc, url);
    };

    // Inicialização
    function init() {
        console.info(`${LOG_PREFIX} script carregado`);
        setupMenu();
        showDemoNotifications();
    }

    window.addEventListener('load', init);

})();
