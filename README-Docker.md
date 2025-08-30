# 🐳 Docker Compose para Site de Evento Integrado

Este projeto inclui uma configuração completa do Docker Compose para executar o site de evento integrado INOFAS & ENAGROTECH 2025.

## 🚀 Como usar

### Pré-requisitos
- Docker instalado
- Docker Compose instalado
- Portas 8080, 8081 e 3306 disponíveis

### 1. Iniciar os serviços
```bash
# Construir e iniciar todos os serviços
docker-compose up -d --build

# Ou apenas iniciar (se já foi construído)
docker-compose up -d
```

### 2. Acessar o site
- **Site principal**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
  - Usuário: `root`
  - Senha: `root123`

### 3. Parar os serviços
```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (cuidado: isso apaga o banco de dados)
docker-compose down -v
```

## 📁 Estrutura dos serviços

### 🌐 Web (Apache + PHP)
- **Porta**: 8080
- **Imagem**: PHP 8.2 + Apache
- **Extensões PHP**: mysqli, pdo_mysql, gd, curl, mbstring, openssl, json, xml, opcache
- **Volume**: `./Site` → `/var/www/html`

### 🗄️ MySQL
- **Porta**: 3306
- **Versão**: MySQL 8.0
- **Banco**: `site_evento`
- **Usuário**: `site_user`
- **Senha**: `site123`
- **Root**: `root123`

### 🎛️ phpMyAdmin
- **Porta**: 8081
- **Acesso**: Interface web para gerenciar o banco MySQL

## 🔧 Configurações

### Apache
- Mod_rewrite habilitado
- Headers CORS configurados para a API
- Cache para arquivos estáticos

### PHP
- Memory limit: 256M
- Upload max: 100M
- Timezone: America/Sao_Paulo
- Extensões de segurança habilitadas

### Banco de Dados
- Tabelas criadas automaticamente:
  - `participantes`: Dados dos inscritos
  - `pagamentos`: Histórico de pagamentos
  - `eventos`: Informações dos eventos

## 🐛 Troubleshooting

### Verificar logs
```bash
# Logs do serviço web
docker-compose logs web

# Logs do MySQL
docker-compose logs mysql

# Logs de todos os serviços
docker-compose logs
```

### Reconstruir containers
```bash
# Reconstruir um serviço específico
docker-compose build web

# Reconstruir todos os serviços
docker-compose build --no-cache
```

### Acessar container
```bash
# Acessar o container web
docker-compose exec web bash

# Acessar o MySQL
docker-compose exec mysql mysql -u root -p
```

## 📝 Variáveis de ambiente

As principais configurações podem ser alteradas no arquivo `docker-compose.yml`:

- **Portas**: Altere os números das portas se necessário
- **Senhas**: Modifique as senhas do MySQL para produção
- **Volumes**: Ajuste os caminhos dos volumes conforme sua estrutura

## 🔒 Segurança

⚠️ **Importante**: As senhas padrão são apenas para desenvolvimento. Para produção:

1. Altere todas as senhas
2. Use variáveis de ambiente para senhas
3. Configure firewall adequadamente
4. Use HTTPS em produção

## 📚 Comandos úteis

```bash
# Ver status dos serviços
docker-compose ps

# Reiniciar um serviço
docker-compose restart web

# Ver uso de recursos
docker stats

# Limpar containers não utilizados
docker system prune
```
