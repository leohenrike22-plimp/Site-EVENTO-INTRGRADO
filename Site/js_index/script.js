//--JS DO CODIGO VVV-->

console.log("Modal element:", document.getElementById('registration-modal'));
console.log("Close button:", document.getElementById('close-modal'));
console.log("Registration form:", document.getElementById('registration-form'));// ===============================
// Variáveis de estado da inscrição
// ===============================
let currentCategory = '';
let currentPrice = 0;
let includesWork = false;

// ===============================
// Seleção de elementos do DOM
// ===============================
const modal = document.getElementById('registration-modal'); // Modal de inscrição
const closeModalBtn = document.getElementById('close-modal'); // Botão de fechar modal
const registrationForm = document.getElementById('registration-form'); // Formulário
const modalForm = document.getElementById('modal-form'); // Conteúdo do formulário dentro do modal
const confirmation = document.getElementById('confirmation'); // Mensagem de confirmação
const newRegistrationBtn = document.getElementById('new-registration'); // Botão para nova inscrição
const workTitleGroup = document.getElementById('work-title-group'); // Campo título do trabalho
const heroInscribeBtn = document.getElementById('hero-inscribe-btn'); // Botão "Inscreva-se" do hero
const showFormBtn = document.getElementById('show-registration-form'); // Botão "Realizar Inscrição" da seção

// ===============================
// Função para abrir o modal
// ===============================
function openModal() {
    // Remove seleção anterior de categoria
    document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));

    
    // Reseta o formulário
    registrationForm.reset();

    // Mostra o formulário e esconde a confirmação
    modalForm.style.display = 'block';
    confirmation.style.display = 'none';

    // Exibe o modal
    modal.style.display = 'flex';
}

// ===============================
// Ações para abrir modal pelos botões
// ===============================
heroInscribeBtn.addEventListener('click', openModal);
showFormBtn.addEventListener('click', openModal);

// ===============================
// Seleção de categoria dentro do modal
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
            workTitleGroup.style.display = 'block';
        } else {
            workTitleGroup.style.display = 'none';
        }
    });
});

// ===============================
// Fechar modal
// ===============================
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// ===============================
// Botão "Nova Inscrição"
// ===============================
newRegistrationBtn.addEventListener('click', () => {
    confirmation.style.display = 'none';
    modalForm.style.display = 'block';
});

// ===============================
// Seleção da forma de pagamento
// ===============================
document.getElementById("forma-pagamento").addEventListener("change", function () {
    const container = document.getElementById("campos-pagamento");
    container.innerHTML = "";

    // PIX
    if (this.value === "pix") {
        container.innerHTML = `
            <div class="form-group">
                <label for="valor">Valor</label>
                <input type="number" id="valor" name="valor" value="${currentPrice}" readonly>
            </div>
        `;
    }

    // Cartão
    if (this.value === "cartao") {
        container.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="numero-cartao">Número do Cartão <span class="required">*</span></label>
                    <input type="text" id="numero-cartao" name="numero-cartao" maxlength="16" required>
                </div>
                <div class="form-group">
                    <label for="nome-cartao">Nome no Cartão <span class="required">*</span></label>
                    <input type="text" id="nome-cartao" name="nome-cartao" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="validade">Validade (MM/AA) <span class="required">*</span></label>
                    <input type="text" id="validade" name="validade" placeholder="MM/AA" required>
                </div>
                <div class="form-group">
                    <label for="cvv">CVV <span class="required">*</span></label>
                    <input type="text" id="cvv" name="cvv" maxlength="4" required>
                </div>
            </div>
            <div class="form-group">
                <label for="valor">Valor</label>
                <input type="number" id="valor" name="valor" value="${currentPrice}" readonly>
            </div>
        `;
    }

    // Boleto
    if (this.value === "boleto") {
        container.innerHTML = `
            <div class="form-group">
                <label for="cpf">CPF/CNPJ <span class="required">*</span></label>
                <input type="text" id="cpf" name="cpf" required>
            </div>
            <div class="form-group">
                <label for="valor">Valor</label>
                <input type="number" id="valor" name="valor" value="${currentPrice}" readonly>
            </div>
        `;
    }
});

// ===============================
// Envio do formulário (integração API)
// ===============================
registrationForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Verifica se categoria foi selecionada
    if (!currentCategory) {
        alert('Por favor, selecione uma categoria de inscrição.');
        return;
    }

    // Coleta os dados do formulário
    const formData = new FormData(this);
    const json = Object.fromEntries(formData.entries());

    // Adiciona categoria e preço
    json.category = currentCategory;
    json.price = currentPrice;

    try {
        // Envia para a API
        const resposta = await fetch("api/pagamento.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        });

        const resultado = await resposta.json();
        console.log(resultado);

        // Mostra confirmação se sucesso
        if (resultado.status === 'success') {
            modalForm.style.display = 'none';
            confirmation.style.display = 'block';
            registrationForm.reset();
        } else {
            alert("Ocorreu um erro no pagamento: " + resultado.error);
        }
    } catch (error) {
        alert("Erro na comunicação com a API: " + error);
    }
});

// ===============================
// Menu mobile toggle
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
// Scroll suave
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
