USE serviceflow;

INSERT INTO tenants (id, company_name, email, plan, status)
VALUES (1, 'ServiceFlow Demonstração', 'admin@serviceflow.local', 'pro', 'active')
ON DUPLICATE KEY UPDATE company_name = VALUES(company_name);

INSERT INTO users (tenant_id, name, email, password_hash, role, email_verified_at)
VALUES (1, 'Administrador', 'admin@serviceflow.local', '$2y$10$nVtifYPn67e.yvxSZ/ppget0W2DGJMsWrfWd.S7W2i.FZk.i0VDTC', 'owner', NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  email_verified_at = VALUES(email_verified_at);

INSERT INTO service_categories (tenant_id, name, color) VALUES
(1, 'Manutenção', '#2563eb'),
(1, 'Instalação', '#0f766e'),
(1, 'Consultoria', '#7c3aed');

INSERT INTO customers (tenant_id, name, document, phone, whatsapp, email, zipcode, address, city, state, notes, lgpd_consent_at) VALUES
(1, 'Ana Martins', '123.456.789-10', '(11) 99999-1010', '5511999991010', 'ana@email.com', '01310-100', 'Av. Paulista', 'São Paulo', 'SP', 'Cliente recorrente.', NOW()),
(1, 'Oficina Sol Nascente', '12.345.678/0001-99', '(21) 3333-2020', '552133332020', 'contato@sol.local', '20040-020', 'Rua da Quitanda', 'Rio de Janeiro', 'RJ', 'Contrato mensal.', NOW());

INSERT INTO services (tenant_id, service_category_id, name, description, price, average_minutes, color, is_favorite) VALUES
(1, 1, 'Manutenção preventiva', 'Checklist completo com relatório técnico.', 180.00, 90, '#2563eb', TRUE),
(1, 2, 'Instalação padrão', 'Instalação com materiais básicos.', 320.00, 150, '#0f766e', TRUE),
(1, 3, 'Visita técnica', 'Diagnóstico e orçamento.', 120.00, 60, '#7c3aed', FALSE);

INSERT INTO suppliers (tenant_id, name, phone, email) VALUES
(1, 'Distribuidora Central', '(11) 4000-1000', 'vendas@central.local');

INSERT INTO products (tenant_id, supplier_id, name, sku, barcode, qr_code, quantity, minimum_quantity, cost_price, sale_price) VALUES
(1, 1, 'Cabo PP 2x1,5mm', 'CAB-PP-15', '789000000001', 'SF-CAB-PP-15', 120, 20, 3.20, 5.90),
(1, 1, 'Conector rápido', 'CON-RAP', '789000000002', 'SF-CON-RAP', 45, 10, 2.10, 4.50);

INSERT INTO work_orders (tenant_id, customer_id, code, title, description, status, scheduled_at, total) VALUES
(1, 1, 'OS-0001', 'Instalação residencial', 'Instalação e testes finais.', 'completed', DATE_SUB(NOW(), INTERVAL 10 DAY), 320.00),
(1, 2, 'OS-0002', 'Manutenção mensal', 'Preventiva do contrato.', 'in_progress', DATE_ADD(NOW(), INTERVAL 2 DAY), 180.00);

INSERT INTO work_order_services (work_order_id, service_id, quantity, unit_price, total) VALUES
(1, 2, 1, 320.00, 320.00),
(2, 1, 1, 180.00, 180.00);

INSERT INTO transaction_categories (tenant_id, name, type, color) VALUES
(1, 'Serviços', 'income', '#0f766e'),
(1, 'Materiais', 'expense', '#dc2626'),
(1, 'Assinaturas', 'expense', '#9333ea');

INSERT INTO financial_transactions (tenant_id, work_order_id, category_id, description, type, amount, due_date, paid_at, status) VALUES
(1, 1, 1, 'Receita OS-0001', 'income', 320.00, CURRENT_DATE, CURRENT_DATE, 'paid'),
(1, NULL, 2, 'Compra de materiais', 'expense', 98.50, CURRENT_DATE, NULL, 'pending');

INSERT INTO subscriptions (tenant_id, plan, status, current_period_start, current_period_end)
VALUES (1, 'pro', 'active', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY));
