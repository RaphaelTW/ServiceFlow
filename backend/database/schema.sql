CREATE DATABASE IF NOT EXISTS serviceflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE serviceflow;

SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS v_low_stock_products;
DROP VIEW IF EXISTS v_dashboard_metrics;
DROP PROCEDURE IF EXISTS sp_close_work_order;
DROP PROCEDURE IF EXISTS sp_monthly_cashflow;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS backups;
DROP TABLE IF EXISTS api_tokens;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS work_order_materials;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS financial_transactions;
DROP TABLE IF EXISTS transaction_categories;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS media_uploads;
DROP TABLE IF EXISTS work_order_services;
DROP TABLE IF EXISTS work_orders;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS service_categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE tenants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(160) NOT NULL,
  document VARCHAR(32) NULL,
  phone VARCHAR(32) NULL,
  email VARCHAR(160) NULL,
  logo_path VARCHAR(255) NULL,
  plan ENUM('free', 'pro', 'business') NOT NULL DEFAULT 'free',
  status ENUM('active', 'trialing', 'past_due', 'canceled') NOT NULL DEFAULT 'active',
  custom_domain VARCHAR(160) NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(140) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('owner', 'admin', 'technician', 'financial', 'viewer') NOT NULL DEFAULT 'owner',
  two_factor_secret VARCHAR(255) NULL,
  email_verified_at TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE user_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  device_name VARCHAR(120) NULL,
  ip_address VARCHAR(45) NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessions_user (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE password_resets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(160) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_password_resets_email (email)
) ENGINE=InnoDB;

CREATE TABLE customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  document VARCHAR(32) NULL,
  phone VARCHAR(32) NULL,
  whatsapp VARCHAR(32) NULL,
  email VARCHAR(160) NULL,
  zipcode VARCHAR(16) NULL,
  address VARCHAR(180) NULL,
  address_number VARCHAR(20) NULL,
  district VARCHAR(100) NULL,
  city VARCHAR(100) NULL,
  state CHAR(2) NULL,
  photo_path VARCHAR(255) NULL,
  notes TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  lgpd_consent_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customers_tenant_name (tenant_id, name),
  INDEX idx_customers_document (document),
  CONSTRAINT fk_customers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE service_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(16) NOT NULL DEFAULT '#2563eb',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_categories_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  service_category_id BIGINT UNSIGNED NULL,
  name VARCHAR(140) NOT NULL,
  description TEXT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  average_minutes INT UNSIGNED NOT NULL DEFAULT 60,
  color VARCHAR(16) NOT NULL DEFAULT '#0f766e',
  image_path VARCHAR(255) NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_services_tenant_name (tenant_id, name),
  CONSTRAINT fk_services_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_services_category FOREIGN KEY (service_category_id) REFERENCES service_categories(id)
) ENGINE=InnoDB;

CREATE TABLE work_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  assigned_user_id BIGINT UNSIGNED NULL,
  code VARCHAR(32) NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  status ENUM('open', 'in_progress', 'completed', 'canceled') NOT NULL DEFAULT 'open',
  scheduled_at DATETIME NULL,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  latitude DECIMAL(10,8) NULL,
  longitude DECIMAL(11,8) NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  pdf_path VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_work_order_code (tenant_id, code),
  INDEX idx_orders_status_date (tenant_id, status, scheduled_at),
  CONSTRAINT fk_orders_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT fk_orders_user FOREIGN KEY (assigned_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE work_order_services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  work_order_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_services_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_services_service FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB;

CREATE TABLE media_uploads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  work_order_id BIGINT UNSIGNED NULL,
  customer_id BIGINT UNSIGNED NULL,
  type ENUM('before', 'after', 'customer_photo', 'service_image', 'product_image', 'logo', 'document') NOT NULL,
  disk ENUM('local', 's3') NOT NULL DEFAULT 'local',
  path VARCHAR(255) NOT NULL,
  mime_type VARCHAR(80) NULL,
  size_bytes BIGINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_media_tenant_type (tenant_id, type),
  CONSTRAINT fk_media_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_media_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  CONSTRAINT fk_media_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE signatures (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  work_order_id BIGINT UNSIGNED NOT NULL,
  customer_name VARCHAR(160) NOT NULL,
  signature_path VARCHAR(255) NOT NULL,
  signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NULL,
  CONSTRAINT fk_signatures_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_signatures_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
) ENGINE=InnoDB;

CREATE TABLE transaction_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  color VARCHAR(16) NOT NULL DEFAULT '#334155',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transaction_categories_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE financial_transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  work_order_id BIGINT UNSIGNED NULL,
  category_id BIGINT UNSIGNED NULL,
  description VARCHAR(180) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_at DATE NULL,
  installments INT UNSIGNED NOT NULL DEFAULT 1,
  status ENUM('pending', 'paid', 'canceled') NOT NULL DEFAULT 'pending',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_finance_tenant_due (tenant_id, due_date, status),
  CONSTRAINT fk_finance_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_finance_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  CONSTRAINT fk_finance_category FOREIGN KEY (category_id) REFERENCES transaction_categories(id)
) ENGINE=InnoDB;

CREATE TABLE suppliers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  document VARCHAR(32) NULL,
  phone VARCHAR(32) NULL,
  email VARCHAR(160) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_suppliers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  supplier_id BIGINT UNSIGNED NULL,
  name VARCHAR(140) NOT NULL,
  sku VARCHAR(80) NULL,
  barcode VARCHAR(80) NULL,
  qr_code VARCHAR(120) NULL,
  quantity DECIMAL(12,3) NOT NULL DEFAULT 0,
  minimum_quantity DECIMAL(12,3) NOT NULL DEFAULT 0,
  cost_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  sale_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  image_path VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_tenant_name (tenant_id, name),
  INDEX idx_products_barcode (barcode),
  CONSTRAINT fk_products_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
) ENGINE=InnoDB;

CREATE TABLE work_order_materials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  work_order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity DECIMAL(12,3) NOT NULL,
  unit_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_materials_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_materials_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE inventory_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  work_order_id BIGINT UNSIGNED NULL,
  type ENUM('in', 'out', 'adjustment') NOT NULL,
  quantity DECIMAL(12,3) NOT NULL,
  notes VARCHAR(180) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inventory_product (product_id, created_at),
  CONSTRAINT fk_inventory_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_inventory_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
) ENGINE=InnoDB;

CREATE TABLE subscriptions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  plan ENUM('free', 'pro', 'business') NOT NULL,
  status ENUM('active', 'trialing', 'past_due', 'canceled') NOT NULL DEFAULT 'active',
  current_period_start DATE NULL,
  current_period_end DATE NULL,
  canceled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subscriptions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  subscription_id BIGINT UNSIGNED NULL,
  amount DECIMAL(12,2) NOT NULL,
  method VARCHAR(40) NOT NULL,
  status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_payments_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
) ENGINE=InnoDB;

CREATE TABLE coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  percent_off DECIMAL(5,2) NULL,
  amount_off DECIMAL(12,2) NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE api_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  abilities JSON NULL,
  last_used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_api_tokens_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE backups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  status ENUM('queued', 'running', 'completed', 'failed') NOT NULL DEFAULT 'queued',
  disk ENUM('local', 's3') NOT NULL DEFAULT 'local',
  path VARCHAR(255) NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_backups_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  title VARCHAR(160) NOT NULL,
  body VARCHAR(255) NOT NULL,
  channel ENUM('app', 'email', 'push', 'whatsapp') NOT NULL DEFAULT 'app',
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE access_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  method VARCHAR(8) NOT NULL,
  path VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_access_logs_tenant_date (tenant_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tenant_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  old_values JSON NULL,
  new_values JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_tenant_entity (tenant_id, entity, entity_id)
) ENGINE=InnoDB;

DELIMITER $$

CREATE TRIGGER trg_work_order_services_total
AFTER INSERT ON work_order_services
FOR EACH ROW
BEGIN
  UPDATE work_orders
     SET subtotal = (SELECT COALESCE(SUM(total), 0) FROM work_order_services WHERE work_order_id = NEW.work_order_id),
         total = (SELECT COALESCE(SUM(total), 0) FROM work_order_services WHERE work_order_id = NEW.work_order_id) - discount
   WHERE id = NEW.work_order_id;
END$$

CREATE TRIGGER trg_material_stock_out
AFTER INSERT ON work_order_materials
FOR EACH ROW
BEGIN
  UPDATE products SET quantity = quantity - NEW.quantity WHERE id = NEW.product_id;
  INSERT INTO inventory_movements (tenant_id, product_id, work_order_id, type, quantity, notes)
  SELECT tenant_id, NEW.product_id, NEW.work_order_id, 'out', NEW.quantity, 'Baixa automática por OS'
    FROM work_orders WHERE id = NEW.work_order_id;
END$$

CREATE PROCEDURE sp_monthly_cashflow(IN p_tenant_id BIGINT UNSIGNED, IN p_year INT)
BEGIN
  SELECT
    MONTH(due_date) AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS profit
  FROM financial_transactions
  WHERE tenant_id = p_tenant_id
    AND YEAR(due_date) = p_year
    AND deleted_at IS NULL
  GROUP BY MONTH(due_date)
  ORDER BY month;
END$$

CREATE PROCEDURE sp_close_work_order(IN p_work_order_id BIGINT UNSIGNED)
BEGIN
  UPDATE work_orders
     SET status = 'completed', completed_at = NOW()
   WHERE id = p_work_order_id;

  INSERT INTO financial_transactions (tenant_id, work_order_id, description, type, amount, due_date, status)
  SELECT tenant_id, id, CONCAT('Receita OS ', code), 'income', total, CURRENT_DATE, 'pending'
    FROM work_orders
   WHERE id = p_work_order_id AND total > 0;
END$$

DELIMITER ;

CREATE OR REPLACE VIEW v_dashboard_metrics AS
SELECT
  t.id AS tenant_id,
  COUNT(DISTINCT c.id) AS customers_count,
  SUM(CASE WHEN wo.status IN ('open', 'in_progress') THEN 1 ELSE 0 END) AS open_orders,
  SUM(CASE WHEN wo.status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
  COALESCE((SELECT SUM(amount) FROM financial_transactions ft WHERE ft.tenant_id = t.id AND ft.type = 'income' AND MONTH(ft.due_date) = MONTH(CURRENT_DATE) AND YEAR(ft.due_date) = YEAR(CURRENT_DATE) AND ft.is_active = 1), 0) AS monthly_revenue,
  COALESCE((SELECT SUM(amount) FROM financial_transactions ft WHERE ft.tenant_id = t.id AND ft.type = 'income' AND YEAR(ft.due_date) = YEAR(CURRENT_DATE) AND ft.is_active = 1), 0) AS annual_revenue
FROM tenants t
LEFT JOIN customers c ON c.tenant_id = t.id AND c.is_active = 1
LEFT JOIN work_orders wo ON wo.tenant_id = t.id AND wo.is_active = 1
GROUP BY t.id;

CREATE OR REPLACE VIEW v_low_stock_products AS
SELECT tenant_id, id AS product_id, name, quantity, minimum_quantity
FROM products
WHERE is_active = 1 AND quantity <= minimum_quantity;
