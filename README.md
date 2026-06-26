# ServiceFlow

ServiceFlow é um SaaS simples para prestadores de serviço, com Web, Mobile e API REST compartilhada.

## Stack

- Web: React, Vite, TypeScript
- Mobile: React Native, Expo
- Backend: PHP 8.3 alvo, compatível com PHP 8.2+
- Banco: MySQL
- Autenticação: JWT + bcrypt

## Estrutura

```text
/backend   API REST versionada em /api/v1
/frontend  Aplicação Web React
/mobile    Aplicação Expo Android/iOS
```

## Como rodar

1. Copie o arquivo de ambiente:

```bash
copy .env.example .env
```

2. Crie o banco MySQL e rode:

```bash
mysql -u root -p serviceflow < backend/database/schema.sql
mysql -u root -p serviceflow < backend/database/seed.sql
```

Para bancos já criados antes da coluna `is_active`, rode:

```bash
mysql -u root -p serviceflow < backend/database/migrations/2026_06_26_add_is_active.sql
mysql -u root -p serviceflow < backend/database/migrations/2026_06_26_refresh_active_views.sql
```

3. Backend:

```bash
cd backend
composer install
composer dump-autoload
php -S localhost:8080 -t public
```

4. Frontend:

```bash
cd frontend
npm install
npm run dev
```

5. Mobile:

```bash
cd mobile
npm install
npm run start
```

## Usuário inicial

- E-mail: `admin@serviceflow.local`
- Senha: `ServiceFlow@123`

## Planos

- Gratuito: até 30 clientes e 10 ordens de serviço/mês
- Pro: R$ 39,90/mês
- Empresa: R$ 79,90/mês

## Observações de produção

- Configure HTTPS no servidor web.
- Altere `JWT_SECRET` em produção.
- Use storage externo para uploads quando migrar para S3.
- Ative filas para e-mail, backup automático e integrações pesadas.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [API REST](docs/API.md)
