# 🎯 Modal de Inscrição Melhorado - INOFAS & ENAGROTECH 2025

## ✨ **Melhorias Implementadas**

### 🎨 **Design e UX**
- **Layout organizado em seções**: Formulário dividido em seções lógicas para melhor organização
- **Indicadores visuais**: Cores e ícones para diferentes estados (erro, sucesso, seleção)
- **Animações suaves**: Transições e animações para melhor experiência do usuário
- **Responsividade**: Layout adaptável para diferentes tamanhos de tela

### 🔧 **Funcionalidades**
- **Validação em tempo real**: Verificação de campos obrigatórios e formatos
- **Máscaras de entrada**: Formatação automática para CPF, telefone, cartão e validade
- **Contador de caracteres**: Para o resumo do trabalho com indicadores visuais
- **Visualização de resumo**: Botão para revisar dados antes da submissão
- **Gerenciamento de campos condicionais**: Campos de trabalho aparecem apenas quando necessário

### 📱 **Acessibilidade**
- **Labels descritivos**: Cada campo tem label claro e indicador de obrigatoriedade
- **Mensagens de erro**: Feedback visual claro para problemas de validação
- **Navegação por teclado**: Suporte completo para navegação sem mouse
- **ARIA labels**: Atributos para leitores de tela

## 🏗️ **Estrutura do Modal**

### 📋 **Seções do Formulário**
1. **Seleção de Categoria**
   - Cards interativos para cada tipo de inscrição
   - Preços e benefícios claramente exibidos
   - Seleção visual com indicadores de estado

2. **Informações Pessoais**
   - Nome completo, e-mail, telefone e CPF
   - Validação de formato para cada campo
   - Máscaras automáticas para formatação

3. **Informações Acadêmicas**
   - Instituição e curso
   - Campos obrigatórios para todos os tipos

4. **Submissão de Trabalho** (condicional)
   - Título e resumo do trabalho
   - Contador de caracteres com limites
   - Aparece apenas para categorias que incluem trabalho

5. **Informações de Pagamento**
   - Resumo da categoria selecionada
   - Seleção de forma de pagamento
   - Campos específicos para cada método

6. **Resumo da Inscrição**
   - Visualização completa dos dados
   - Confirmação antes da submissão

## 🎨 **Sistema de Cores**

### 🌈 **Paleta Principal**
- **Primary**: `#2e7d32` (Verde principal)
- **Secondary**: `#ff9800` (Laranja)
- **Accent**: `#2196f3` (Azul)
- **Success**: `#4caf50` (Verde sucesso)
- **Warning**: `#ff9800` (Laranja aviso)
- **Error**: `#f44336` (Vermelho erro)

### 📏 **Espaçamentos**
- **XS**: `0.25rem` (4px)
- **SM**: `0.5rem` (8px)
- **MD**: `1rem` (16px)
- **LG**: `1.5rem` (24px)
- **XL**: `2rem` (32px)
- **2XL**: `3rem` (48px)

## 🔍 **Validações Implementadas**

### ✅ **Campos Obrigatórios**
- Categoria de inscrição
- Nome completo
- E-mail válido
- Telefone válido
- CPF válido
- Instituição
- Curso
- Forma de pagamento

### 📧 **Validação de E-mail**
- Formato padrão de e-mail
- Verificação de domínio básico
- Feedback visual imediato

### 📱 **Validação de Telefone**
- Formato brasileiro: (00) 00000-0000
- Suporte para celular e fixo
- Máscara automática durante digitação

### 🆔 **Validação de CPF**
- Formato: 000.000.000-00
- Máscara automática
- Validação básica de formato

### 📝 **Validação de Trabalho**
- Título obrigatório (se aplicável)
- Resumo obrigatório (se aplicável)
- Limite de 300 caracteres
- Contador visual

## 🚀 **Como Usar**

### 📱 **Abrir Modal**
```javascript
// Clicar no botão "Inscreva-se" do banner
// Clicar no botão "Realizar Inscrição" da seção
```

### 🔄 **Fluxo de Inscrição**
1. **Selecionar categoria** → Campos de trabalho aparecem se necessário
2. **Preencher dados pessoais** → Validação em tempo real
3. **Preencher dados acadêmicos** → Campos obrigatórios
4. **Adicionar trabalho** (se aplicável) → Título e resumo
5. **Escolher pagamento** → Campos específicos aparecem
6. **Visualizar resumo** → Revisar todos os dados
7. **Finalizar inscrição** → Processamento e confirmação

### 🎯 **Estados do Modal**
- **Fechado**: Modal oculto
- **Aberto**: Formulário visível
- **Carregando**: Processamento em andamento
- **Confirmado**: Sucesso da inscrição

## 🛠️ **Tecnologias Utilizadas**

### 🎨 **Frontend**
- **HTML5**: Estrutura semântica
- **CSS3**: Variáveis CSS, Grid, Flexbox, Animações
- **JavaScript ES6+**: Módulos, arrow functions, async/await

### 📱 **Responsividade**
- **Mobile First**: Design baseado em dispositivos móveis
- **Breakpoints**: 480px, 768px, 1024px
- **Flexbox/Grid**: Layouts adaptáveis

### 🎭 **Animações**
- **CSS Transitions**: Transições suaves
- **CSS Keyframes**: Animações personalizadas
- **JavaScript**: Controle de estados

## 🔧 **Personalização**

### 🎨 **Cores**
```css
:root {
    --primary: #2e7d32;        /* Cor principal */
    --secondary: #ff9800;      /* Cor secundária */
    --accent: #2196f3;         /* Cor de destaque */
    --success: #4caf50;        /* Cor de sucesso */
    --error: #f44336;          /* Cor de erro */
}
```

### 📏 **Espaçamentos**
```css
:root {
    --spacing-xs: 0.25rem;     /* 4px */
    --spacing-sm: 0.5rem;      /* 8px */
    --spacing-md: 1rem;        /* 16px */
    --spacing-lg: 1.5rem;      /* 24px */
    --spacing-xl: 2rem;        /* 32px */
    --spacing-2xl: 3rem;       /* 48px */
}
```

### 🎭 **Animações**
```css
:root {
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

## 📱 **Compatibilidade**

### 🌐 **Navegadores**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 📱 **Dispositivos**
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iOS, Android)
- ✅ Mobile (iOS, Android)

## 🚀 **Próximas Melhorias**

### 🔮 **Funcionalidades Futuras**
- [ ] Integração com API de pagamento real
- [ ] Upload de arquivos (PDF do trabalho)
- [ ] Sistema de cupons de desconto
- [ ] Histórico de inscrições
- [ ] Notificações por e-mail/SMS
- [ ] Dashboard do participante

### 🎨 **Melhorias de Design**
- [ ] Temas personalizáveis
- [ ] Modo escuro
- [ ] Mais animações e micro-interações
- [ ] Componentes reutilizáveis

---

## 📞 **Suporte**

Para dúvidas ou sugestões sobre o modal de inscrição, entre em contato:
- **Email**: inofas.enagrotech@ifgoiano.edu.br
- **Telefone**: (64) 3413-0300

---

**Desenvolvido com ❤️ para INOFAS & ENAGROTECH 2025**
# README.md

# Projeto INOFAS & ENAGROTECH 2025

Este projeto consiste em um site para os eventos integrados promovidos pelo IF Goiano - Campus Morrinhos. O site contém informações sobre os eventos, objetivos, inscrições e contatos, além de uma área de administração.

## Estrutura do Projeto

O projeto possui a seguinte estrutura de arquivos:

```
Site-EVENTO-INTRGRADO
├── Site
│   ├── about.html          # Página com informações sobre os eventos
│   ├── contact.html        # Página de contato
│   ├── index.html          # Página inicial do site
│   ├── objectives.html      # Página com os objetivos dos eventos
│   ├── registration.html    # Página de inscrições
│   ├── ADMpainel.html       # Página de administração
│   ├── css_index
│   │   └── style.css       # Arquivo de estilos CSS
│   ├── js_index
│   │   └── script.js       # Arquivo de scripts JavaScript
│   └── images
│       └── 4.png          # Imagem utilizada no banner da página inicial
└── README.md               # Documentação do projeto
```

## Instruções de Uso

1. **Instalação**: Para utilizar o projeto, clone o repositório e abra a pasta `Site` em um servidor local ou diretamente em um navegador.

2. **Navegação**: Utilize a barra de navegação para acessar as diferentes seções do site:
   - **Sobre**: Informações sobre os eventos.
   - **Objetivos**: Detalhes sobre os objetivos dos eventos.
   - **Inscrições**: Informações sobre como se inscrever.
   - **Contato**: Informações de contato.

3. **Estilização**: Todas as páginas HTML referenciam o arquivo `css_index/style.css` para garantir uma aparência consistente.

4. **Interatividade**: O arquivo `js_index/script.js` contém scripts para funcionalidades interativas, como a abertura de modais.

5. **Administração**: Acesse a página de administração através do link na barra de navegação.

## Testes

Após implementar as alterações, teste todos os links de navegação para garantir que eles redirecionem corretamente para as páginas desejadas e que a estilização seja aplicada de forma consistente.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorias no projeto.