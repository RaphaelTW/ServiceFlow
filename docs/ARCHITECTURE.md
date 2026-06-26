# Arquitetura

O ServiceFlow foi organizado como monorepo para manter Web, Mobile e API evoluindo com o mesmo contrato.

## Backend

- `controllers`: entrada HTTP e adaptação de payloads.
- `services`: regras de negócio, como autenticação e limites de planos.
- `repositories`: acesso a dados via PDO e prepared statements.
- `middleware`: segurança, CORS, autenticação JWT e rate limit.
- `routes`: versionamento REST em `/api/v1`.
- `database`: schema, views, triggers, procedures e seeders.

O backend segue MVC com separação inspirada em Clean Architecture: controllers não acessam SQL diretamente, serviços concentram regras e repositórios isolam persistência.

## Multiempresa

As entidades operacionais usam `tenant_id`, permitindo separar clientes, serviços, ordens, financeiro, estoque, usuários e logs por empresa.

## Segurança

- Senhas com bcrypt.
- JWT assinado com HS256.
- Prepared statements.
- Headers contra XSS/clickjacking.
- Rate limit por IP.
- Tabelas para auditoria, logs, sessões, tokens e consentimento LGPD.

## Escalabilidade

Pontos prontos para evoluir:

- Storage local hoje, S3 depois via `media_uploads.disk`.
- Backup automático via tabela `backups`.
- WhatsApp, push e e-mail via tabela `notifications`.
- Planos e pagamento via `subscriptions`, `payments` e `coupons`.
- Sincronização mobile offline usando filas locais no app.

