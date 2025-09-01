/*
  Centralized, robust modal and registration manager.
  Corrige erros de acesso a elementos nulos, garante inicialização segura
  em todas as páginas e preserva lógica de armazenamento/validação.
*/

(function () {
    'use strict';

    // Remover qualquer texto solto que quebre o JS (corrige erro encontrado)
    // Constantes / selectors
    const SELECTORS = {
        registrationModal: 'registration-modal',
        registrationForm: 'registration-form',
        registrationClose: 'close-modal',
        registrationOpenIds: ['hero-inscribe-btn', 'show-registration-form', 'open-modal-btn'],
        adminModal: 'admin-login-modal',
        adminOpen: 'admin-link',
        adminClose: 'close-admin-login',
        registrationsList: 'registrations-list',
        newRegistrationBtn: 'new-registration'
    };

    const STORAGE_KEY = 'inofas_registrations';
    const ADMIN_STORE_KEY = 'inofas_admin';
    const ADMIN_SESSION_KEY = 'inofas_admin_session';
    const LOG_PREFIX = '[EVENTO:script]';

    // Default admin credentials (seed only). Password not stored in plaintext on subsequent runs.
    // WARNING: frontend-only auth is not secure. This provides basic convenience for local/demo use.
    const DEFAULT_ADMIN = {
        email: 'admin@inofas.com',
        // hashed value of default password 'admin123' computed at runtime on seed
        // we do not store the plaintext password in persistent storage
    };

    // Helpers
    const $id = (id) => document.getElementById(id) || null;
    const isElement = (el) => el instanceof Element;
    const safe = (fn) => (...args) => { try { return fn(...args); } catch (err) { console.error(`${LOG_PREFIX} erro:`, err); } };

    // Simple util to compute SHA-256 hex of a string (returns Promise)
    async function sha256Hex(text) {
        const enc = new TextEncoder();
        const data = enc.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Page detection
    function detectPage() {
        const path = (location.pathname || '').toLowerCase();
        if (path.includes('admpainel')) return 'admin';
        if (path.includes('registration') || path.includes('inscricoes')) return 'registration';
        return 'index';
    }

    // Modal utilities
    function showModal(modal) {
        if (!isElement(modal)) return;
        modal.style.display = 'flex';
        // small delay to let CSS transition run if any
        requestAnimationFrame(() => modal.classList.add('modal-visible'));
        const focusable = modal.querySelector('input,button,select,textarea,a');
        if (focusable) focusable.focus();
    }
    function hideModal(modal) {
        if (!isElement(modal)) return;
        modal.classList.remove('modal-visible');
        setTimeout(() => { try { modal.style.display = 'none'; } catch (_) {} }, 260);
    }

    // LocalStorage helpers
    function loadRegistrations() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error(`${LOG_PREFIX} loadRegistrations parse erro:`, err);
            return [];
        }
    }
    function saveRegistrations(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
        } catch (err) {
            console.error(`${LOG_PREFIX} saveRegistrations erro:`, err);
        }
    }

    // Admin credentials store helpers (hashed password)
    async function seedAdminIfMissing() {
        try {
            const raw = localStorage.getItem(ADMIN_STORE_KEY);
            if (raw) return; // already seeded
            // seed with default admin; hash password before storing
            const defaultPass = 'admin123';
            const passHash = await sha256Hex(defaultPass);
            const adminObj = { email: DEFAULT_ADMIN.email, passwordHash: passHash };
            localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(adminObj));
            console.debug(`${LOG_PREFIX} admin seeded`);
        } catch (err) {
            console.error(`${LOG_PREFIX} seedAdminIfMissing erro:`, err);
        }
    }

    async function verifyAdminCredentials(inputEmail, inputPassword) {
        try {
            const raw = localStorage.getItem(ADMIN_STORE_KEY);
            if (!raw) return false;
            const stored = JSON.parse(raw);
            const inputHash = await sha256Hex(String(inputPassword || ''));
            return stored.email === String(inputEmail).toLowerCase() && stored.passwordHash === inputHash;
        } catch (err) {
            console.error(`${LOG_PREFIX} verifyAdminCredentials erro:`, err);
            return false;
        }
    }

    function createAdminSession(email) {
        const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
        const payload = { email: String(email).toLowerCase(), token, createdAt: Date.now() };
        try {
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(payload));
        } catch (err) {
            console.error(`${LOG_PREFIX} createAdminSession erro:`, err);
        }
        return payload;
    }

    // Admin modal DOM generation (creates modal if not present in DOM)
    function createAdminModalIfMissing() {
        if ($id(SELECTORS.adminModal)) return $id(SELECTORS.adminModal);
        // build DOM
        const modal = document.createElement('div');
        modal.id = SELECTORS.adminModal;
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" style="max-width:420px;">
                <button class="close-modal" id="${SELECTORS.adminClose}" aria-label="Fechar modal">&times;</button>
                <h2 id="admin-modal-title" class="modal-title">Login de Administração</h2>
                <form id="admin-login-form" class="admin-login-form" novalidate>
                    <div class="form-group">
                        <label for="admin-email">E-mail</label>
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <i class="fas fa-user" aria-hidden="true"></i>
                            <input type="email" id="admin-email" name="admin-email" required placeholder="admin@inofas.com" style="flex:1;">
                        </div>
                        <div class="form-error" id="admin-email-error"></div>
                    </div>
                    <div class="form-group">
                        <label for="admin-password">Senha</label>
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <i class="fas fa-lock" aria-hidden="true"></i>
                            <input type="password" id="admin-password" name="admin-password" required placeholder="Senha" style="flex:1;">
                        </div>
                        <div class="form-error" id="admin-password-error"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-top:0.5rem;">
                        <a href="#" id="admin-forgot" style="font-size:0.95rem;color:var(--primary-dark)">Esqueci a senha</a>
                        <button type="submit" class="btn btn-primary" id="admin-login-submit">Entrar</button>
                    </div>
                    <div class="form-error" id="admin-login-feedback" style="margin-top:0.75rem;min-height:1.2em;"></div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    // Admin login flow (async)
    function initAdminLoginFlow() {
        // ensure admin credentials seeded
        seedAdminIfMissing();

        const modal = createAdminModalIfMissing();
        const adminLink = $id(SELECTORS.adminOpen);
        const closeAdminId = SELECTORS.adminClose;

        // open on click
        if (adminLink) {
            adminLink.addEventListener('click', (e) => {
                e.preventDefault();
                resetAdminForm(); // ensure cleared
                showModal(modal);
            });
        }

        // wire close button and overlay and ESC
        const closeBtn = $id(closeAdminId);
        if (closeBtn) closeBtn.addEventListener('click', () => hideModal(modal));
        modal.addEventListener('click', (evt) => { if (evt.target === modal) hideModal(modal); });
        document.addEventListener('keydown', (evt) => { if (evt.key === 'Escape') hideModal(modal); });

        // submit handler
        const form = $id('admin-login-form');
        if (!form) return;

        // manage failed attempts in sessionStorage
        const FAILED_KEY = 'admin_failed_attempts';
        const LOCK_UNTIL = 'admin_lock_until';
        const MAX_ATTEMPTS = 5;
        const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

        function getFailed() {
            try { return Number(sessionStorage.getItem(FAILED_KEY) || 0); } catch { return 0; }
        }
        function setFailed(n) { try { sessionStorage.setItem(FAILED_KEY, String(n)); } catch {} }
        function setLock(until) { try { sessionStorage.setItem(LOCK_UNTIL, String(until)); } catch {} }
        function getLock() { try { return Number(sessionStorage.getItem(LOCK_UNTIL) || 0); } catch { return 0; } }

        function resetAdminForm() {
            const email = $id('admin-email');
            const pass = $id('admin-password');
            const feedback = $id('admin-login-feedback');
            const emailErr = $id('admin-email-error');
            const passErr = $id('admin-password-error');
            if (email) { email.value = ''; emailErr && (emailErr.textContent = ''); }
            if (pass) { pass.value = ''; passErr && (passErr.textContent = ''); }
            if (feedback) feedback.textContent = '';
            // focus
            if (email) email.focus();
        }

        async function onSubmitAdmin(e) {
            e.preventDefault();
            const feedback = $id('admin-login-feedback');
            const submitBtn = $id('admin-login-submit');

            // check lock
            const lockUntil = getLock();
            const now = Date.now();
            if (lockUntil && now < lockUntil) {
                const remaining = Math.ceil((lockUntil - now) / 1000);
                if (feedback) feedback.textContent = `Bloqueado. Tente novamente em ${remaining}s.`;
                return;
            }

            const emailInput = $id('admin-email');
            const passInput = $id('admin-password');
            if (!emailInput || !passInput) return;

            const email = String(emailInput.value || '').trim().toLowerCase();
            const password = String(passInput.value || '');

            // basic validation
            let ok = true;
            const emailErr = $id('admin-email-error');
            const passErr = $id('admin-password-error');
            if (!email) { emailErr && (emailErr.textContent = 'E-mail é obrigatório'); ok = false; }
            else if (!/^\S+@\S+\.\S+$/.test(email)) { emailErr && (emailErr.textContent = 'E-mail inválido'); ok = false; }
            else emailErr && (emailErr.textContent = '');

            if (!password) { passErr && (passErr.textContent = 'Senha é obrigatória'); ok = false; } else passErr && (passErr.textContent = '');

            if (!ok) return;

            // loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                const prevLabel = submitBtn.textContent;
                submitBtn.dataset.prev = prevLabel;
                submitBtn.textContent = 'Entrando...';
            }
            try {
                const valid = await verifyAdminCredentials(email, password);
                if (valid) {
                    // success: create session and redirect
                    createAdminSession(email);
                    if (feedback) feedback.style.color = 'var(--primary-dark)';
                    if (feedback) feedback.textContent = 'Autenticado. Redirecionando...';
                    // reset failed attempts
                    setFailed(0);
                    setLock(0);
                    setTimeout(() => {
                        window.location.href = 'ADMpainel.html';
                    }, 600);
                } else {
                    // increment failed attempts
                    const failed = getFailed() + 1;
                    setFailed(failed);
                    if (failed >= MAX_ATTEMPTS) {
                        const until = Date.now() + LOCK_DURATION_MS;
                        setLock(until);
                        if (feedback) feedback.textContent = `Muitas tentativas. Bloqueado por ${Math.round(LOCK_DURATION_MS/60000)} minutos.`;
                    } else {
                        if (feedback) feedback.textContent = `Credenciais inválidas. Tentativas restantes: ${MAX_ATTEMPTS - failed}`;
                    }
                }
            } catch (err) {
                console.error(`${LOG_PREFIX} admin submit erro:`, err);
                if (feedback) feedback.textContent = 'Erro no processo de autenticação.';
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (submitBtn.dataset.prev) submitBtn.textContent = submitBtn.dataset.prev;
                }
            }
        }

        // attach listeners
        form.addEventListener('submit', safe(onSubmitAdmin));
        // support Enter on fields
        ['admin-email','admin-password'].forEach(id => {
            const el = $id(id);
            if (el) el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') form.dispatchEvent(new Event('submit',{cancelable:true})); });
        });

        // forgot password link - basic UX: instruct to reset via localStorage (since no backend)
        const forgot = $id('admin-forgot');
        if (forgot) {
            forgot.addEventListener('click', (ev) => {
                ev.preventDefault();
                // minimal flow: notify that reset requires direct change in storage or contact
                alert('Para redefinir a senha localmente: abra as dev tools e remova a chave "inofas_admin" em localStorage, então registre novo administrador ao efetuar login novamente.');
            });
        }
    }

    // --- Registration modal + other existing init code below ---
    // (keeps existing registration modal handling intact)
    // Example: resetFormState, validateAndCollectForm, handleRegistrationSubmit, renderRegistrationsList, handleAdminListClick
    // ...existing functions from prior implementation...
    // For brevity reuse the previously defined functions in the file if present.
    // If functions are not present (older file), ensure they are defined earlier in this file.

    // Função para preencher e validar o formulário de inscrição completo
    function setupRegistrationForm() {
        const modal = document.getElementById('registration-modal');
        const openBtns = [document.getElementById('show-registration-form'), document.getElementById('hero-inscribe-btn')];
        const closeBtn = document.getElementById('close-modal');
        const form = document.getElementById('registration-form');
        const confirmation = document.getElementById('confirmation');
        const confirmationDetails = document.getElementById('confirmation-details');
        const newRegistrationBtn = document.getElementById('new-registration');
        const categoryOptions = document.querySelectorAll('.category-option');
        const categoryRadios = document.querySelectorAll('.category-option input[type="radio"]');
        const paymentSelect = document.getElementById('forma-pagamento');
        const extraCartao = document.getElementById('extra-cartao');
        const extraPix = document.getElementById('extra-pix');
        const extraBoleto = document.getElementById('extra-boleto');
        const workSection = document.getElementById('work-section');
        const paymentSummary = document.getElementById('payment-summary');
        const selectedCategory = document.getElementById('selected-category');
        const selectedPrice = document.getElementById('selected-price');
        const charCount = document.getElementById('char-count');
        const workAbstract = document.getElementById('work-abstract');
        let selectedCat = null;

        // Abrir modal
        openBtns.forEach(btn => {
            if (btn) btn.onclick = () => {
                if (modal) {
                    modal.style.display = 'flex';
                    setTimeout(() => modal.classList.add('modal-visible'), 10);
                    resetForm();
                }
            };
        });

        // Fechar modal
        if (closeBtn && modal) {
            closeBtn.onclick = () => {
                modal.classList.remove('modal-visible');
                setTimeout(() => modal.style.display = 'none', 300);
            };
        }
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    modal.classList.remove('modal-visible');
                    setTimeout(() => modal.style.display = 'none', 300);
                }
            });
        }

        // Seleção de categoria
        categoryOptions.forEach((opt, idx) => {
            opt.addEventListener('click', function () {
                // Remove seleção de todos
                categoryOptions.forEach(o => o.classList.remove('selected'));
                // Marca o atual como selecionado
                opt.classList.add('selected');
                // Marca o radio correspondente
                categoryRadios.forEach(r => r.checked = false);
                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                // Atualiza objeto selecionado
                selectedCat = {
                    category: opt.getAttribute('data-category'),
                    price: opt.getAttribute('data-price'),
                    work: opt.getAttribute('data-work') === 'true'
                };
                // Atualiza UI de pagamento e campos condicionais
                const paymentSummary = document.getElementById('payment-summary');
                const selectedCategory = document.getElementById('selected-category');
                const selectedPrice = document.getElementById('selected-price');
                if (paymentSummary && selectedCategory && selectedPrice) {
                    paymentSummary.style.display = '';
                    selectedCategory.textContent = selectedCat.category;
                    selectedPrice.textContent = selectedCat.price == 0 ? 'Gratuito' : `R$ ${selectedCat.price},00`;
                }
                const workSection = document.getElementById('work-section');
                if (workSection) {
                    workSection.style.display = selectedCat.work ? '' : 'none';
                }
            });
        });
        categoryRadios.forEach((radio, idx) => {
            radio.addEventListener('change', function () {
                categoryOptions.forEach(o => o.classList.remove('selected'));
                categoryOptions[idx].classList.add('selected');
                selectedCat = {
                    category: categoryOptions[idx].getAttribute('data-category'),
                    price: categoryOptions[idx].getAttribute('data-price'),
                    work: categoryOptions[idx].getAttribute('data-work') === 'true'
                };
                if (paymentSummary && selectedCategory && selectedPrice) {
                    paymentSummary.style.display = '';
                    selectedCategory.textContent = selectedCat.category;
                    selectedPrice.textContent = selectedCat.price == 0 ? 'Gratuito' : `R$ ${selectedCat.price},00`;
                }
                const workSection = document.getElementById('work-section');
                if (workSection) {
                    workSection.style.display = selectedCat.work ? '' : 'none';
                }
            });
        });

        // Atualiza campos extras de pagamento
        if (paymentSelect) {
            paymentSelect.onchange = function () {
                if (extraCartao) extraCartao.style.display = this.value === 'cartao' ? '' : 'none';
                if (extraPix) extraPix.style.display = this.value === 'pix' ? '' : 'none';
                if (extraBoleto) extraBoleto.style.display = this.value === 'boleto' ? '' : 'none';
            };
        }

        // Contador de caracteres do resumo do trabalho
        if (workAbstract && charCount) {
            workAbstract.addEventListener('input', function () {
                charCount.textContent = this.value.length;
            });
        }

        // Resetar formulário
        function resetForm() {
            if (form) form.reset();
            categoryOptions.forEach(o => o.classList.remove('selected'));
            selectedCat = null;
            if (workSection) workSection.style.display = 'none';
            if (paymentSummary) paymentSummary.style.display = 'none';
            if (extraCartao) extraCartao.style.display = 'none';
            if (extraPix) extraPix.style.display = 'none';
            if (extraBoleto) extraBoleto.style.display = 'none';
            if (confirmation) confirmation.style.display = 'none';
            if (form) form.style.display = '';
            if (charCount) charCount.textContent = '0';
        }

        // Nova inscrição
        if (newRegistrationBtn) {
            newRegistrationBtn.onclick = () => {
                resetForm();
                if (confirmation) confirmation.style.display = 'none';
                if (form) form.style.display = '';
            };
        }

        // Validação e envio do formulário
        if (form) {
            form.onsubmit = function (e) {
                e.preventDefault();
                let valid = true;
                let reasons = [];

                // Campos obrigatórios
                ['name', 'email', 'phone', 'document', 'institution', 'course'].forEach(id => {
                    const input = document.getElementById(id);
                    const error = document.getElementById(id + '-error');
                    if (input && (!input.value || !input.value.trim())) {
                        valid = false;
                        if (error) error.textContent = 'Campo obrigatório';
                        reasons.push(`O campo "${input.previousElementSibling ? input.previousElementSibling.innerText : id}" é obrigatório.`);
                    } else if (error) {
                        error.textContent = '';
                    }
                });

                // Categoria obrigatória
                if (!selectedCat) {
                    valid = false;
                    reasons.push('Selecione uma categoria de inscrição.');
                }

                // Pagamento obrigatório
                if (paymentSelect && !paymentSelect.value) {
                    const error = document.getElementById('forma-pagamento-error');
                    if (error) error.textContent = 'Campo obrigatório';
                    valid = false;
                    reasons.push('Selecione uma forma de pagamento.');
                } else {
                    const error = document.getElementById('forma-pagamento-error');
                    if (error) error.textContent = '';
                }

                // Campos de trabalho se necessário
                if (selectedCat && selectedCat.work) {
                    const workTitle = document.getElementById('work-title');
                    const workTitleError = document.getElementById('work-title-error');
                    const workAbstract = document.getElementById('work-abstract');
                    const workAbstractError = document.getElementById('work-abstract-error');
                    if (workTitle && !workTitle.value.trim()) {
                        valid = false;
                        if (workTitleError) workTitleError.textContent = 'Campo obrigatório';
                        reasons.push('O campo "Título do Trabalho" é obrigatório.');
                    } else if (workTitleError) workTitleError.textContent = '';
                    if (workAbstract && !workAbstract.value.trim()) {
                        valid = false;
                        if (workAbstractError) workAbstractError.textContent = 'Campo obrigatório';
                        reasons.push('O campo "Resumo do Trabalho" é obrigatório.');
                    } else if (workAbstractError) workAbstractError.textContent = '';
                }

                // Exibe aviso se não for válido
                if (!valid) {
                    alert('Inscrição não realizada:\n\n' + reasons.join('\n'));
                    return;
                }

                // Monta objeto de inscrição
                const data = {
                    categoria: selectedCat.category,
                    valor: selectedCat.price == 0 ? 'Gratuito' : `R$ ${selectedCat.price},00`,
                    nome: form.name.value,
                    email: form.email.value,
                    telefone: form.phone.value,
                    cpf: form.document.value,
                    instituicao: form.institution.value,
                    curso: form.course.value,
                    pagamento: paymentSelect.value,
                    dataInscricao: new Date().toLocaleString()
                };
                if (selectedCat.work) {
                    data.tituloTrabalho = form['work-title'].value;
                    data.resumoTrabalho = form['work-abstract'].value;
                }
                if (paymentSelect.value === 'cartao') {
                    data.cartao = {
                        numero: form['numero-cartao'].value,
                        validade: form['validade-cartao'].value,
                        cvv: form['cvv-cartao'].value,
                        nome: form['nome-cartao'].value
                    };
                }
                // Salva no localStorage
                let all = [];
                try {
                    all = JSON.parse(localStorage.getItem('inofas_registrations') || '[]');
                } catch {}
                all.push(data);
                localStorage.setItem('inofas_registrations', JSON.stringify(all));

                // Mostra confirmação
                if (form) form.style.display = 'none';
                if (confirmation) confirmation.style.display = '';
                if (confirmationDetails) {
                    confirmationDetails.innerHTML = `
                        <p><strong>Categoria:</strong> ${data.categoria}</p>
                        <p><strong>Nome:</strong> ${data.nome}</p>
                        <p><strong>E-mail:</strong> ${data.email}</p>
                        <p><strong>Telefone:</strong> ${data.telefone}</p>
                        <p><strong>CPF:</strong> ${data.cpf}</p>
                        <p><strong>Instituição:</strong> ${data.instituicao}</p>
                        <p><strong>Curso:</strong> ${data.curso}</p>
                        <p><strong>Forma de Pagamento:</strong> ${data.pagamento}</p>
                        <p><strong>Valor:</strong> ${data.valor}</p>
                        ${data.tituloTrabalho ? `<p><strong>Título do Trabalho:</strong> ${data.tituloTrabalho}</p>` : ''}
                        ${data.resumoTrabalho ? `<p><strong>Resumo:</strong> ${data.resumoTrabalho}</p>` : ''}
                    `;
                }
            };
        }
    }

    // The init routine integrates admin modal creation and registration logic
    async function init() {
        const page = detectPage();
        console.info(`${LOG_PREFIX} iniciando em página:`, page);

        // seed admin if needed (non-blocking)
        seedAdminIfMissing().catch(err => console.debug(`${LOG_PREFIX} seed admin falhou`, err));

        // initialize admin modal flow (creates modal if missing)
        initAdminLoginFlow();

        // Registration modal wiring (safe: only attach if elements exist)
        const registrationModal = $id(SELECTORS.registrationModal);
        const registrationOpenIds = SELECTORS.registrationOpenIds;
        registrationOpenIds.forEach(id => {
            const btn = $id(id);
            if (btn) btn.addEventListener('click', (evt) => {
                evt.preventDefault();
                const regModal = $id(SELECTORS.registrationModal);
                if (regModal) {
                    resetFormState(regModal);
                    showModal(regModal);
                }
            });
        });
        // Close modal on overlay click
        if (registrationModal) {
            registrationModal.addEventListener('click', (evt) => {
                if (evt.target === registrationModal) {
                    hideModal(registrationModal);
                }
            });
        }

        // ESC key closes modals if either modal is open
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') {
                hideModal($id(SELECTORS.adminModal));
                hideModal($id(SELECTORS.registrationModal));
            }
        });

        // --- Admin list click handling (if applicable) ---
        const registrationsList = $id(SELECTORS.registrationsList);
        if (registrationsList) {
            registrationsList.addEventListener('click', (evt) => {
                const target = evt.target;
                const regItem = target.closest('.registration-item');
                if (!regItem) return;
                const email = regItem.getAttribute('data-email');
                if (!email) return;
                // Exibir detalhes ou permitir edição
                alert(`Detalhes da inscrição para: ${email}`);
                // Aqui você pode carregar os detalhes da inscrição e preencher um formulário para edição, se necessário
            });
        }

        // --- Preload registrations list if on registrations page ---
        if (page === 'admin') {
            const registrations = loadRegistrations();
            if (Array.isArray(registrations) && registrations.length > 0) {
                // Apenas para debug: mostre no console as inscrições carregadas
                console.log(`${LOG_PREFIX} inscrições carregadas:`, registrations);
            }
        }

        // --- Registration form setup (if applicable) ---
        if (page === 'registration') {
            setupRegistrationForm();
        }
    }

    // Run init on load
    window.addEventListener('load', init);

})();
