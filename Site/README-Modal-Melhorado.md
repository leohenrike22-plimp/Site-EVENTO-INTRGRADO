# 🌱 Site Evento Integrado - INOFAS & ENAGROTECH 2025

Site institucional para os eventos integrados **INOFAS** (Encontro Nacional de Inovações Tecnológicas para a Agricultura Familiar e Agroindústria Sustentáveis) e **ENAGROTECH** (Ciência e Tecnologia no Campo), promovidos pelo IF Goiano - Campus Morrinhos.

## 📋 Visão Geral

Este projeto apresenta uma solução web completa para divulgação, inscrição e gerenciamento de eventos acadêmicos, com foco em inovação tecnológica para agricultura familiar e sustentável.

## ✨ Funcionalidades Principais

### 🎯 **Páginas Institucionais**
- **Página inicial**: Banner interativo, cards informativos e sistema de notificações
- **Sobre**: Informações detalhadas sobre ambos os eventos (INOFAS e ENAGROTECH)
- **Objetivos**: Metas e propósitos dos eventos organizados em grid responsivo
- **Programação**: Sistema de abas para visualização da programação por dias (14-17/10)
- **Comissão**: Apresentação da equipe organizadora e palestrantes
- **Contato**: Informações de contato e localização
- **Submissão de Trabalhos**: Sistema de accordion com normas, áreas temáticas e prazos

### 🎨 **Design e UX**
- **Layout responsivo**: Adaptável para desktop, tablet e mobile
- **Sistema de cores**: Paleta baseada em verde (#2E7D32) e laranja (#FF9800)
- **Tipografia moderna**: Fonte Segoe UI com hierarquia clara
- **Animações suaves**: Transições CSS para melhor experiência do usuário
- **Banner interativo**: Imagem de destaque com overlay e botões de ação

### 📱 **Responsividade**
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: 640px, 900px, 1200px
- **Menu hambúrguer**: Navegação colapsável em telas pequenas
- **Cards adaptativos**: Layout flexível com grid system

### 🔔 **Sistema de Notificações**
- **Carrossel automático**: Rotação de notificações com controle de tempo
- **Notificações especiais**: Suporte a imagens e links externos
- **Controle de exibição**: Máximo de 3 notificações simultâneas
- **Animações**: Fade in/out com efeitos CSS

### 📄 **Gestão de Conteúdo**
- **Accordion interativo**: Seções expansíveis para submissão de trabalhos
- **Tabelas estilizadas**: Apresentação de áreas temáticas e prazos
- **Cards informativos**: Organização visual do conteúdo
- **Abas dinâmicas**: Navegação por dias na programação

## 🏗️ Estrutura do Projeto

```
Site-EVENTO-INTRGRADO/
├── Site/
│   ├── about.html                 # Sobre os eventos
│   ├── objectives.html            # Objetivos dos eventos
│   ├── registration.html          # Página de inscrições
│   ├── programação.html           # Programação detalhada
│   ├── comissão.html             # Comissão organizadora
│   ├── contact.html              # Informações de contato
│   ├── SubmissãoDeTrabalhos.html # Normas e submissão
│   ├── css_index/
│   │   └── style.css             # Estilos principais
│   ├── js_index/
│   │   └── script.js             # Scripts interativos
│   └── images/                   # Recursos visuais
├── docker/                       # Configurações Docker
├── index.html                    # Página inicial
├── docker-compose.yml           # Orquestração de containers
└── README.md                    # Documentação principal
```

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5**: Estrutura semântica com acessibilidade
- **CSS3**: 
  - Variáveis CSS customizadas
  - Flexbox e Grid Layout
  - Animações e transições
  - Media queries responsivas
- **JavaScript ES6+**:
  - Manipulação do DOM
  - Sistema de notificações
  - Menu responsivo
  - Controle de abas

### **Recursos Externos**
- **Font Awesome 6.4.0**: Ícones vetoriais
- **Google Fonts**: Tipografia otimizada
- **CDN**: Carregamento otimizado de recursos

### **DevOps**
- **Docker**: Containerização completa
- **Apache**: Servidor web
- **MySQL**: Banco de dados
- **phpMyAdmin**: Interface de administração

## 🚀 Como Ejecutar

### **Método 1: Servidor Local**
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Navegue até a pasta do projeto
cd Site-EVENTO-INTRGRADO

# Abra com servidor local (Python)
python -m http.server 8000

# Ou abra diretamente o index.html no navegador
```

### **Método 2: Docker (Recomendado)**
```bash
# Inicie os serviços
docker-compose up -d --build

# Acesse o site
# http://localhost:8080

# phpMyAdmin (opcional)
# http://localhost:8081
```

## 🎨 Personalização

### **Cores do Tema**
```css
:root {
    --primary: #2e7d32;        /* Verde principal */
    --primary-dark: #1b5e20;   /* Verde escuro */
    --secondary: #ff9800;      /* Laranja */
    --accent: #43e97b;         /* Verde claro */
    --light: #e8f5e9;          /* Verde muito claro */
}
```

### **Responsividade**
```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (max-width: 900px) { ... }

/* Desktop pequeno */
@media (max-width: 1200px) { ... }
```

### **Configurações de Notificação**
```javascript
const NOTIFICATION_DURATION = 5000;        // 5 segundos
const MAX_NOTIFICATIONS = 3;               // Máximo simultâneo
const SEMANACT_NOTIFICATION_DURATION = 6000; // Tempo estendido
```

## 📋 Páginas e Funcionalidades

### **🏠 Página Inicial (`index.html`)**
- Banner com imagem de destaque
- Botões de ação (Inscreva-se, Saiba Mais)
- Cards informativos sobre os eventos
- Sistema de notificações dinâmico

### **ℹ️ Sobre (`about.html`)**
- Descrição detalhada do INOFAS
- Descrição detalhada do ENAGROTECH
- Layout em cards responsivos

### **🎯 Objetivos (`objectives.html`)**
- 6 objetivos principais organizados em grid
- Design com cards hover
- Texto explicativo para cada objetivo

### **📅 Programação (`programação.html`)**
- Sistema de abas para 4 dias (14-17/10)
- Divisão por períodos (manhã, tarde, noite)
- Informações de palestrantes e locais
- Cards de atividades com horários

### **👥 Comissão (`comissão.html`)**
- Grid de membros da comissão
- Fotos e informações dos integrantes
- Seção separada para palestrantes

### **📝 Submissão (`SubmissãoDeTrabalhos.html`)**
- Sistema accordion interativo
- Normas de submissão detalhadas
- Tabela de áreas temáticas
- Links para modelos de documentos

### **📞 Contato (`contact.html`)**
- Informações de contato organizadas em cards
- Localização do evento
- Telefone e email institucional

## 🔧 Recursos Técnicos

### **Sistema de Navegação**
- Menu fixo no topo
- Indicação da página ativa
- Menu hambúrguer responsivo
- Links relativos otimizados

### **Sistema de Notificações**
- Carrossel automático
- Suporte a imagens
- Links clicáveis
- Controle de duração
- Animações CSS

### **Acessibilidade**
- Labels descritivos
- ARIA attributes
- Navegação por teclado
- Contraste adequado
- Semântica HTML5

## 🐳 Configuração Docker

### **Serviços Incluídos**
- **Web**: Apache + PHP 8.2 (Porta 8080)
- **MySQL**: Banco de dados (Porta 3306)
- **phpMyAdmin**: Interface web (Porta 8081)

### **Credenciais Padrão**
```
MySQL:
- Usuário: site_user
- Senha: site123
- Root: root123

phpMyAdmin:
- http://localhost:8081
- Usuário: root
- Senha: root123
```

## 📱 Compatibilidade

### **Navegadores Suportados**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Dispositivos Testados**
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iOS, Android)
- ✅ Mobile (iOS, Android)

## 🔐 Segurança

### **Boas Práticas Implementadas**
- Validação de entrada no frontend
- Sanitização de dados
- Headers de segurança configurados
- HTTPS ready (produção)

### **Para Produção**
- [ ] Alterar senhas padrão
- [ ] Configurar HTTPS
- [ ] Implementar CSP headers
- [ ] Configurar firewall adequado

## 📈 Performance

### **Otimizações Aplicadas**
- Compressão de imagens
- Minificação de CSS/JS (produção)
- Cache de recursos estáticos
- CDN para bibliotecas externas
- Lazy loading de imagens

## 🚀 Roadmap

### **Próximas Funcionalidades**
- [ ] Sistema de inscrição integrado
- [ ] Painel administrativo completo
- [ ] API para gestão de inscrições
- [ ] Sistema de pagamento online
- [ ] Certificados digitais automáticos
- [ ] Dashboard de analytics

### **Melhorias Técnicas**
- [ ] PWA (Progressive Web App)
- [ ] Service Workers para cache
- [ ] Modo offline básico
- [ ] Otimização de Core Web Vitals

## 📞 Suporte e Contato

### **Informações do Evento**
- **Email**: inofasenagrotech.mhos@ifgoiano.edu.br
- **Telefone**: (64) 3413-0300
- **Local**: IF Goiano - Campus Morrinhos
- **Endereço**: BR-153, Km 633, Zona Rural, Morrinhos - GO

### **Suporte Técnico**
Para questões técnicas sobre o site, entre em contato através dos canais oficiais do evento.

## 📄 Licença

Este projeto é de uso institucional do IF Goiano e pode ser adaptado conforme necessário para eventos similares, respeitando os créditos originais.

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🏷️ Versão

**Versão Atual**: 2.0.0
- ✅ Sistema de notificações implementado
- ✅ Design responsivo completo
- ✅ Programação por abas
- ✅ Sistema accordion para submissões
- ✅ Configuração Docker completa

---

**Desenvolvido com ❤️ para INOFAS & ENAGROTECH 2025**  
*IF Goiano - Campus Morrinhos*