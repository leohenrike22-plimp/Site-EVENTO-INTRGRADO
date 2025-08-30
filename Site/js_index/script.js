//--JS DO CODIGO VVV-->

console.log("Modal element:", document.getElementById('registration-modal'));
console.log("Close button:", document.getElementById('close-modal'));
console.log("Registration form:", document.getElementById('registration-form'));// ===============================
// VARIÁVEIS DE ESTADO DA INSCRIÇÃO
// ===============================
let currentCategory = '';
let currentPrice = 0;
let includesWork = false;
let formData = {};

// ===============================
// SELEÇÃO DE ELEMENTOS DO DOM
// ===============================
const modal = document.getElementById('registration-modal');
const closeModalBtn = document.getElementById('close-modal');
const registrationForm = document.getElementById('registration-form');
const modalForm = document.getElementById('modal-form');
const confirmation = document.getElementById('confirmation');
const newRegistrationBtn = document.getElementById('new-registration');
const workSection = document.getElementById('work-section');
const heroInscribeBtn = document.getElementById('hero-inscribe-btn');
const showFormBtn = document.getElementById('show-registration-form');
const btnPreview = document.getElementById('btn-preview');
const btnSubmit = document.getElementById('btn-submit');

// ===============================
// FUNÇÃO PARA ABRIR O MODAL
// ===============================
function openModal() {
    // Remove seleção anterior de categoria
    document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));
    
    // Reseta o formulário
    registrationForm.reset();
    
    // Limpa erros e estados
    clearFormErrors();
    resetFormState();

    // Mostra o formulário e esconde a confirmação
    modalForm.style.display = 'block';
    confirmation.style.display = 'none';

    // Exibe o modal com animação
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// ===============================
// FUNÇÃO PARA FECHAR O MODAL
// ===============================
function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// ===============================
// AÇÕES PARA ABRIR MODAL PELOS BOTÕES
// ===============================
heroInscribeBtn.addEventListener('click', openModal);
showFormBtn.addEventListener('click', openModal);

// ===============================
// SELEÇÃO DE CATEGORIA DENTRO DO MODAL
// ===============================
document.querySelectorAll('.category-option').forEach(option => {
    option.addEventListener('click', function () {
        // Remove seleção anterior
        document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));

        // Adiciona seleção atual
        this.classList.add('selected');

        // Atualiza dados da categoria
        currentCategory = this.getAttribute('data-category');
        currentPrice = parseInt(this.getAttribute('data-price'));
        includesWork = this.getAttribute('data-work') === 'true';

        // Mostrar/ocultar campo de trabalho
        if (includesWork) {
            workSection.style.display = 'block';
            // Torna os campos de trabalho obrigatórios
            document.getElementById('work-title').required = true;
            document.getElementById('work-abstract').required = true;
        } else {
            workSection.style.display = 'none';
            // Remove obrigatoriedade dos campos de trabalho
            document.getElementById('work-title').required = false;
            document.getElementById('work-abstract').required = false;
        }

        // Atualiza resumo de pagamento
        updatePaymentSummary();
        
        // Mostra seção de pagamento
        document.querySelector('.payment-section').style.display = 'block';
    });
});

// ===============================
// FECHAR MODAL
// ===============================
closeModalBtn.addEventListener('click', closeModal);

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// ===============================
// BOTÃO "NOVA INSCRIÇÃO"
// ===============================
newRegistrationBtn.addEventListener('click', () => {
    confirmation.style.display = 'none';
    modalForm.style.display = 'block';
    openModal();
});

// ===============================
// SELEÇÃO DA FORMA DE PAGAMENTO
// ===============================
document.getElementById("forma-pagamento").addEventListener("change", function () {
    const selectedValue = this.value;
    
    // Esconde todos os campos extras
    document.querySelectorAll('.extra-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    // Mostra campos específicos baseado na seleção
    if (selectedValue === 'cartao') {
        document.getElementById('extra-cartao').classList.add('show');
    } else if (selectedValue === 'pix') {
        document.getElementById('extra-pix').classList.add('show');
    } else if (selectedValue === 'boleto') {
        document.getElementById('extra-boleto').classList.add('show');
    }
});

// ===============================
// CONTADOR DE CARACTERES PARA RESUMO
// ===============================
const workAbstract = document.getElementById('work-abstract');
const charCount = document.getElementById('char-count');

if (workAbstract && charCount) {
    workAbstract.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        // Atualiza classes de cor baseado no limite
        charCount.className = 'form-char-count';
        if (length > 250) {
            charCount.classList.add('warning');
        }
        if (length > 300) {
            charCount.classList.add('danger');
        }
    });
}

// ===============================
// VALIDAÇÃO DE FORMULÁRIO
// ===============================
function validateForm() {
    let isValid = true;
    clearFormErrors();
    
    // Validação de categoria
    if (!currentCategory) {
        showFieldError('category-selector', 'Selecione uma categoria de inscrição');
        isValid = false;
    }
    
    // Validação de campos obrigatórios
    const requiredFields = ['name', 'email', 'phone', 'document', 'institution', 'course', 'forma-pagamento'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.required && !field.value.trim()) {
            showFieldError(fieldId, 'Este campo é obrigatório');
            isValid = false;
        }
    });
    
    // Validação de e-mail
    const email = document.getElementById('email');
    if (email && email.value && !isValidEmail(email.value)) {
        showFieldError('email', 'Digite um e-mail válido');
        isValid = false;
    }
    
    // Validação de CPF
    const document = document.getElementById('document');
    if (document && document.value && !isValidCPF(document.value)) {
        showFieldError('document', 'Digite um CPF válido');
        isValid = false;
    }
    
    // Validação de telefone
    const phone = document.getElementById('phone');
    if (phone && phone.value && !isValidPhone(phone.value)) {
        showFieldError('phone', 'Digite um telefone válido');
        isValid = false;
    }
    
    // Validação de campos de trabalho se necessário
    if (includesWork) {
        const workTitle = document.getElementById('work-title');
        const workAbstract = document.getElementById('work-abstract');
        
        if (!workTitle.value.trim()) {
            showFieldError('work-title', 'Título do trabalho é obrigatório');
            isValid = false;
        }
        
        if (!workAbstract.value.trim()) {
            showFieldError('work-abstract', 'Resumo do trabalho é obrigatório');
            isValid = false;
        }
        
        if (workAbstract.value.length > 300) {
            showFieldError('work-abstract', 'Resumo deve ter no máximo 300 caracteres');
            isValid = false;
        }
    }
    
    return isValid;
}

// ===============================
// FUNÇÕES DE VALIDAÇÃO
// ===============================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidCPF(cpf) {
    const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
    return cpfRegex.test(cpf);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone);
}

// ===============================
// GERENCIAMENTO DE ERROS
// ===============================
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            const errorElement = formGroup.querySelector('.form-error');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
}

// ===============================
// ATUALIZAR RESUMO DE PAGAMENTO
// ===============================
function updatePaymentSummary() {
    const paymentSummary = document.getElementById('payment-summary');
    const selectedCategory = document.getElementById('selected-category');
    const selectedPrice = document.getElementById('selected-price');
    
    if (paymentSummary && selectedCategory && selectedPrice) {
        selectedCategory.textContent = currentCategory;
        selectedPrice.textContent = currentPrice === 0 ? 'Gratuito' : `R$ ${currentPrice.toFixed(2).replace('.', ',')}`;
        paymentSummary.style.display = 'block';
    }
}

// ===============================
// COLETAR DADOS DO FORMULÁRIO
// ===============================
function collectFormData() {
    formData = {
        category: currentCategory,
        price: currentPrice,
        includesWork: includesWork,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        document: document.getElementById('document').value,
        institution: document.getElementById('institution').value,
        course: document.getElementById('course').value,
        paymentMethod: document.getElementById('forma-pagamento').value,
        workTitle: includesWork ? document.getElementById('work-title').value : '',
        workAbstract: includesWork ? document.getElementById('work-abstract').value : ''
    };
    
    // Adiciona campos extras de pagamento se necessário
    if (formData.paymentMethod === 'cartao') {
        formData.cardNumber = document.getElementById('numero-cartao').value;
        formData.cardExpiry = document.getElementById('validade-cartao').value;
        formData.cardCVV = document.getElementById('cvv-cartao').value;
        formData.cardName = document.getElementById('nome-cartao').value;
    }
}

// ===============================
// GERAR RESUMO DA INSCRIÇÃO
// ===============================
function generateSummary() {
    const summarySection = document.getElementById('summary-section');
    const summaryContent = document.getElementById('summary-content');
    
    if (summarySection && summaryContent) {
        let summaryHTML = '';
        
        // Informações básicas
        summaryHTML += `
            <div class="summary-item">
                <span class="summary-item-label">Categoria:</span>
                <span class="summary-item-value">${formData.category}</span>
                </div>
            <div class="summary-item">
                <span class="summary-item-label">Valor:</span>
                <span class="summary-item-value">${formData.price === 0 ? 'Gratuito' : `R$ ${formData.price.toFixed(2).replace('.', ',')}`}</span>
                </div>
            <div class="summary-item">
                <span class="summary-item-label">Nome:</span>
                <span class="summary-item-value">${formData.name}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">E-mail:</span>
                <span class="summary-item-value">${formData.email}</span>
                </div>
            <div class="summary-item">
                <span class="summary-item-label">Telefone:</span>
                <span class="summary-item-value">${formData.phone}</span>
                </div>
            <div class="summary-item">
                <span class="summary-item-label">CPF:</span>
                <span class="summary-item-value">${formData.document}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Instituição:</span>
                <span class="summary-item-value">${formData.institution}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Curso:</span>
                <span class="summary-item-value">${formData.course}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item-label">Forma de Pagamento:</span>
                <span class="summary-item-value">${getPaymentMethodLabel(formData.paymentMethod)}</span>
            </div>
        `;
        
        // Informações de trabalho se aplicável
        if (formData.includesWork) {
            summaryHTML += `
                <div class="summary-item">
                    <span class="summary-item-label">Título do Trabalho:</span>
                    <span class="summary-item-value work-title">${formData.workTitle}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-item-label">Resumo:</span>
                    <span class="summary-item-value work-abstract">${formData.workAbstract}</span>
                </div>
            `;
        }
        
        summaryContent.innerHTML = summaryHTML;
        summarySection.style.display = 'block';
    }
}

// ===============================
// FUNÇÃO AUXILIAR PARA LABEL DE PAGAMENTO
// ===============================
function getPaymentMethodLabel(method) {
    const labels = {
        'pix': 'PIX',
        'cartao': 'Cartão de Crédito/Débito',
        'boleto': 'Boleto Bancário'
    };
    return labels[method] || method;
}

// ===============================
// RESETAR ESTADO DO FORMULÁRIO
// ===============================
function resetFormState() {
    currentCategory = '';
    currentPrice = 0;
    includesWork = false;
    formData = {};
    
    // Esconde seções condicionais
    workSection.style.display = 'none';
    document.getElementById('summary-section').style.display = 'none';
    document.getElementById('payment-summary').style.display = 'none';
    
    // Remove campos obrigatórios de trabalho
    document.getElementById('work-title').required = false;
    document.getElementById('work-abstract').required = false;
    
    // Esconde campos extras de pagamento
    document.querySelectorAll('.extra-fields').forEach(field => {
        field.style.display = 'none';
    });
}

// ===============================
// BOTÃO DE VISUALIZAÇÃO
// ===============================
btnPreview.addEventListener('click', function() {
    if (validateForm()) {
        collectFormData();
        generateSummary();
        
        // Scroll para o resumo
        document.getElementById('summary-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
});

// Função simulada de chamada à API de pagamento
async function processarPagamento(formData) {
    // Se for gratuito, não precisa de pagamento
    if (formData.price === 0) {
        return { status: 'aprovado' };
    }

    // Exemplo de chamada real:
    // const response = await fetch('URL_DA_API_PAGAMENTO', { method: 'POST', body: JSON.stringify(formData) });
    // const result = await response.json();
    // return result;

    // Simulação de resposta da API (substitua pela real)
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: 'aprovado' }); // ou 'rejeitado'
        }, 1500);
    });
}

// ===============================
// SUBMISSÃO DO FORMULÁRIO
// ===============================
registrationForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (validateForm()) {
        collectFormData();

        // Adiciona estado de carregamento
        btnSubmit.classList.add('loading');
        btnSubmit.textContent = 'Processando...';

        // Processa pagamento se necessário
        const resultadoPagamento = await processarPagamento(formData);

        if (resultadoPagamento.status === 'aprovado') {
            // Salva inscrição no localStorage (sem dados de pagamento)
            saveRegistrationToStorage(formData);

            // Gera relatório da inscrição
            const registrationReport = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                document: formData.document,
                institution: formData.institution,
                course: formData.course,
                category: formData.category,
                price: formData.price,
                includesWork: formData.includesWork,
                workTitle: formData.includesWork ? formData.workTitle : '',
                workAbstract: formData.includesWork ? formData.workAbstract : '',
                registration_date: new Date().toLocaleString('pt-BR')
            };
            generateRegistrationReport(registrationReport);

            // Remove estado de carregamento
            btnSubmit.classList.remove('loading');
            btnSubmit.textContent = 'Finalizar Inscrição';

            // Mostra confirmação
            showConfirmation();
        } else {
            btnSubmit.classList.remove('loading');
            btnSubmit.textContent = 'Finalizar Inscrição';
            alert('Pagamento não aprovado. Por favor, tente novamente.');
        }
    }
});

// ===============================
// MOSTRAR CONFIRMAÇÃO
// ===============================
function showConfirmation() {
            modalForm.style.display = 'none';
            confirmation.style.display = 'block';
    
    // Preenche detalhes da confirmação
    const confirmationDetails = document.getElementById('confirmation-details');
    if (confirmationDetails) {
        confirmationDetails.innerHTML = `
            <h4>Detalhes da Inscrição</h4>
            <div class="detail-item">
                <span class="detail-label">Categoria:</span>
                <span class="detail-value">${formData.category}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Valor:</span>
                <span class="detail-value">${formData.price === 0 ? 'Gratuito' : `R$ ${formData.price.toFixed(2).replace('.', ',')}`}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Forma de Pagamento:</span>
                <span class="detail-value">${getPaymentMethodLabel(formData.paymentMethod)}</span>
            </div>
        `;
    }
}

// ===============================
// MÁSCARAS PARA CAMPOS
// ===============================
// Máscara para CPF
const documentField = document.getElementById('document');
if (documentField) {
    documentField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        }
    });
}

// Máscara para telefone
const phoneField = document.getElementById('phone');
if (phoneField) {
    phoneField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
            e.target.value = value;
        }
    });
}

// Máscara para cartão
const cardNumberField = document.getElementById('numero-cartao');
if (cardNumberField) {
    cardNumberField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 16) {
            value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
            e.target.value = value;
        }
    });
}

// Máscara para validade
const expiryField = document.getElementById('validade-cartao');
if (expiryField) {
    expiryField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
            e.target.value = value;
        }
    });
}

// ===============================
// INICIALIZAÇÃO
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    // Esconde seções condicionais inicialmente
    workSection.style.display = 'none';
    document.getElementById('summary-section').style.display = 'none';
    document.getElementById('payment-summary').style.display = 'none';
    
    // Esconde campos extras de pagamento
    document.querySelectorAll('.extra-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    console.log('Modal de inscrição inicializado com sucesso!');
});

// ===============================
// MENU MOBILE TOGGLE
// ===============================
document.querySelector('.menu-btn').addEventListener('click', function () {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// ===============================
// SCROLL SUAVE
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Salvar inscrição no localStorage (sem informações de pagamento)
function saveRegistrationToStorage(formData) {
    // Cria objeto apenas com dados relevantes
    const registration = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        document: formData.document,
        institution: formData.institution,
        course: formData.course,
        category: formData.category,
        price: formData.price,
        includesWork: formData.includesWork,
        workTitle: formData.includesWork ? formData.workTitle : '',
        workAbstract: formData.includesWork ? formData.workAbstract : '',
        registration_date: new Date().toLocaleString('pt-BR') // <-- Garante que a data seja salva!
    };

    // Recupera inscrições já salvas
    let registrations = [];
    const saved = localStorage.getItem('event_registrations');
    if (saved) {
        registrations = JSON.parse(saved);
    }
    registrations.push(registration);
    localStorage.setItem('event_registrations', JSON.stringify(registrations));
}

// ===============================
// GERAR RELATÓRIO DA INSCRIÇÃO (PDF)
// ===============================
function generateRegistrationReport(registration) {
    // Cria o conteúdo do relatório em HTML
    const reportWindow = window.open('', '_blank');
    const reportHtml = `
        <html>
        <head>
            <title>Relatório de Inscrição - ${registration.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; color: #222; }
                h2 { color: #2e7d32; }
                .section { margin-bottom: 24px; }
                .label { font-weight: bold; color: #444; }
                .value { margin-left: 8px; }
                .work-section { margin-top: 16px; }
                .footer { margin-top: 40px; font-size: 0.95em; color: #888; }
            </style>
        </head>
        <body>
            <h2>Relatório de Inscrição</h2>
            <div class="section">
                <span class="label">Nome:</span><span class="value">${registration.name}</span><br>
                <span class="label">E-mail:</span><span class="value">${registration.email}</span><br>
                <span class="label">Telefone:</span><span class="value">${registration.phone}</span><br>
                <span class="label">CPF:</span><span class="value">${registration.document}</span><br>
                <span class="label">Instituição:</span><span class="value">${registration.institution}</span><br>
                <span class="label">Curso:</span><span class="value">${registration.course}</span><br>
                <span class="label">Categoria:</span><span class="value">${registration.category}</span><br>
                <span class="label">Valor:</span><span class="value">${registration.price === 0 ? 'Gratuito' : `R$ ${registration.price},00`}</span><br>
                <span class="label">Data da Inscrição:</span><span class="value">${registration.registration_date}</span>
            </div>
            ${registration.includesWork ? `
            <div class="section work-section">
                <span class="label">Título do Trabalho:</span><span class="value">${registration.workTitle}</span><br>
                <span class="label">Resumo:</span><span class="value">${registration.workAbstract}</span>
            </div>
            ` : ''}
            <div class="footer">
                Relatório gerado automaticamente pelo sistema de inscrições INOFAS & ENAGROTECH 2025.
            </div>
        </body>
        </html>
    `;
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
    reportWindow.focus();
    // Aguarda o carregamento e aciona a impressão (PDF)
    reportWindow.onload = function() {
        reportWindow.print();
    };
}
