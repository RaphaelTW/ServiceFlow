USE serviceflow;

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

