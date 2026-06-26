# API REST

Base URL local:

```text
http://localhost:8080/api/v1
```

## Autenticação

```http
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/logout-all
```

Payload de login:

```json
{
  "email": "admin@serviceflow.local",
  "password": "ServiceFlow@123"
}
```

Use o token retornado:

```http
Authorization: Bearer <token>
```

## Rotas Protegidas

```http
GET /dashboard
GET /reports
GET /settings
PUT /settings
GET /subscriptions
```

## Recursos CRUD

Todos os recursos abaixo aceitam:

```http
GET    /{resource}
POST   /{resource}
GET    /{resource}/{id}
PUT    /{resource}/{id}
PATCH  /{resource}/{id}
DELETE /{resource}/{id}
```

Recursos:

```text
customers
services
work-orders
finance
inventory
```

## Paginação

```http
GET /customers?page=1&per_page=15&search=ana
```

## Limites de Plano

O plano gratuito bloqueia automaticamente:

- Mais de 30 clientes ativos.
- Mais de 10 ordens de serviço no mês.

