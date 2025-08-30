-- Criação do banco de dados (já criado pelo environment do docker-compose)
USE site_evento;

-- Tabela para usuários/participantes
CREATE TABLE IF NOT EXISTS participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    instituicao VARCHAR(255),
    tipo_participante ENUM('estudante', 'professor', 'pesquisador', 'profissional') NOT NULL,
    evento_interesse ENUM('inofas', 'enagrotech', 'ambos') NOT NULL,
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_pagamento ENUM('pendente', 'pago', 'cancelado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participante_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    forma_pagamento ENUM('pix', 'cartao', 'boleto') NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado', 'cancelado') DEFAULT 'pendente',
    transacao_id VARCHAR(255),
    dados_pagamento JSON,
    data_pagamento TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participante_id) REFERENCES participantes(id) ON DELETE CASCADE
);

-- Tabela para eventos
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE,
    local VARCHAR(255),
    capacidade_maxima INT,
    inscritos_atual INT DEFAULT 0,
    status ENUM('ativo', 'inativo', 'encerrado') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir eventos padrão
INSERT INTO eventos (nome, descricao, data_inicio, data_fim, local, capacidade_maxima) VALUES
('INOFAS 2025', 'I Encontro Nacional de Inovações Tecnológicas para a Agricultura Familiar e Agroindústria Sustentáveis', '2025-01-01', '2025-01-03', 'IF Goiano - Campus Morrinhos', 500),
('ENAGROTECH 2025', 'I Encontro Nacional de Ciência e Tecnologia no Campo: Integração Agrícola, Pecuária e Inovações Digitais', '2025-01-01', '2025-01-03', 'IF Goiano - Campus Morrinhos', 500);

-- Índices para melhor performance
CREATE INDEX idx_participantes_email ON participantes(email);
CREATE INDEX idx_participantes_evento ON participantes(evento_interesse);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_pagamentos_participante ON pagamentos(participante_id);
