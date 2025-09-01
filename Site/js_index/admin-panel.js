const registrationsList = document.getElementById('registrations-list');
const registrationsCount = document.getElementById('registrations-count');
const noRegistrations = document.getElementById('no-registrations');
const registrationsContainer = document.getElementById('registrations-container');
const exportBtn = document.getElementById('export-data');
const clearBtn = document.getElementById('clear-data');
const cardsContainer = document.getElementById('registrations-cards-container');

let cardsCount = 0;
let registrations = [];

// Carrega inscrições do localStorage
function loadRegistrations() {
    const saved = localStorage.getItem('event_registrations');
    if (saved) {
        registrations = JSON.parse(saved);
    }
}

// Renderiza os cards de inscrição e contador
function renderRegistrationCards() {
    cardsContainer.innerHTML = '';
    cardsCount = registrations.length;

    let cardsCounterElement = document.getElementById('cards-counter');
    if (!cardsCounterElement) {
        cardsCounterElement = document.createElement('div');
        cardsCounterElement.id = 'cards-counter';
        cardsCounterElement.style.fontWeight = 'bold';
        cardsCounterElement.style.marginBottom = '18px';
        cardsContainer.parentNode.insertBefore(cardsCounterElement, cardsContainer);
    }
    cardsCounterElement.textContent = `Total de inscrições (cards): ${cardsCount}`;

    if (registrations.length === 0) {
        cardsContainer.style.display = 'none';
        cardsCounterElement.style.display = 'none';
        return;
    }
    cardsContainer.style.display = 'flex';
    cardsCounterElement.style.display = 'block';

    registrations.forEach((reg, idx) => {
        const card = document.createElement('div');
        card.style.background = '#f5f5f5';
        card.style.border = '1px solid #e0e0e0';
        card.style.borderRadius = '10px';
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        card.style.padding = '24px';
        card.style.width = '320px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '8px';
        card.innerHTML = `
            <h4 style="color: #2e7d32; margin-bottom: 8px;">${reg.name}</h4>
            <div><strong>E-mail:</strong> ${reg.email}</div>
            <div><strong>Telefone:</strong> ${reg.phone}</div>
            <div><strong>CPF:</strong> ${reg.document}</div>
            <div><strong>Instituição:</strong> ${reg.institution}</div>
            <div><strong>Curso:</strong> ${reg.course}</div>
            <div><strong>Categoria:</strong> ${reg.category}</div>
            <div><strong>Valor:</strong> ${reg.price === 0 ? 'Gratuito' : `R$ ${reg.price},00`}</div>
            ${reg.includesWork ? `<div><strong>Título do Trabalho:</strong> ${reg.workTitle}</div>
            <div><strong>Resumo:</strong> ${reg.workAbstract}</div>` : ''}
            <div style="font-size:0.95em; color:#888; margin-top:8px;"><i class="fa fa-calendar"></i> ${reg.registration_date || ''}</div>
            <button class="btn btn-secondary btn-download-pdf" data-index="${idx}" style="margin-top:12px;">Baixar PDF</button>
        `;
        cardsContainer.appendChild(card);
    });

    // Evento para download do PDF/HTML para cada inscrição
    document.querySelectorAll('.btn-download-pdf').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-index');
            downloadRegistrationPDF(registrations[idx]);
        });
    });
}

// Atualiza a exibição das inscrições e cards
function updateRegistrationsDisplay() {
    registrationsCount.textContent = registrations.length;

    if (registrations.length === 0) {
        registrationsContainer.style.display = 'none';
        noRegistrations.style.display = 'block';
        cardsContainer.style.display = 'none';
        let cardsCounterElement = document.getElementById('cards-counter');
        if (cardsCounterElement) cardsCounterElement.style.display = 'none';
        return;
    }

    registrationsContainer.style.display = 'block';
    noRegistrations.style.display = 'none';

    registrationsList.innerHTML = '';
    registrations.forEach(reg => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reg.name}</td>
            <td>${reg.email}</td>
            <td>${reg.category}</td>
            <td>R$ ${reg.price},00</td>
            <td>${reg.registration_date}</td>
        `;
        registrationsList.appendChild(row);
    });

    renderRegistrationCards();
}

// Exporta todas as inscrições em JSON
function exportRegistrations() {
    if (registrations.length === 0) {
        alert('Não há inscrições para exportar.');
        return;
    }
    const dataStr = JSON.stringify(registrations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `inscricoes_${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    alert(`Dados exportados com sucesso! ${registrations.length} inscrições salvas no arquivo.`);
}

// Limpa todas as inscrições
function clearRegistrations() {
    if (confirm('Tem certeza que deseja limpar todos os dados de inscrição? Esta ação não pode ser desfeita.')) {
        registrations = [];
        localStorage.setItem('event_registrations', JSON.stringify(registrations));
        updateRegistrationsDisplay();
        alert('Todos os dados foram removidos.');
    }
}

// Inicialização do painel
document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations();
    updateRegistrationsDisplay();
});

exportBtn.addEventListener('click', exportRegistrations);
clearBtn.addEventListener('click', clearRegistrations);

// Gera arquivo HTML para download com os dados da inscrição
function downloadRegistrationPDF(registration) {
    const htmlContent = `
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

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscricao_${registration.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Adicione ou ajuste este trecho para exibir todos os campos na tabela do painel admin

function renderRegistrationsList() {
    const listEl = document.getElementById('registrations-list');
    let data = [];
    try {
        data = JSON.parse(localStorage.getItem('inofas_registrations') || '[]');
    } catch {}
    listEl.innerHTML = '';
    if (!data.length) {
        listEl.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;">Nenhuma inscrição encontrada.</td></tr>';
        return;
    }
    data.forEach(reg => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.nome || '-'}</td>
            <td>${reg.email || '-'}</td>
            <td>${reg.categoria || '-'}</td>
            <td>${reg.valor || '-'}</td>
            <td>${reg.dataInscricao || '-'}</td>
            <td>${reg.instituicao || '-'}</td>
            <td>${reg.curso || '-'}</td>
            <td>${reg.pagamento || '-'}</td>
            <td>${reg.tituloTrabalho || '-'}</td>
            <td>${reg.resumoTrabalho ? reg.resumoTrabalho.substring(0, 60) + (reg.resumoTrabalho.length > 60 ? '...' : '') : '-'}</td>
        `;
        listEl.appendChild(tr);
    });
}

// Chame renderRegistrationsList() ao carregar o painel admin
if (document.getElementById('registrations-list')) {
    renderRegistrationsList();
}