USE serviceflow;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_serviceflow_add_is_active$$

CREATE PROCEDURE sp_serviceflow_add_is_active(IN p_table VARCHAR(64), IN p_after VARCHAR(64))
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = p_table
       AND COLUMN_NAME = 'is_active'
  ) THEN
    SET @sql = CONCAT('ALTER TABLE ', p_table, ' ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER ', p_after);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$

DELIMITER ;

CALL sp_serviceflow_add_is_active('customers', 'notes');
CALL sp_serviceflow_add_is_active('service_categories', 'color');
CALL sp_serviceflow_add_is_active('services', 'is_favorite');
CALL sp_serviceflow_add_is_active('work_orders', 'pdf_path');
CALL sp_serviceflow_add_is_active('financial_transactions', 'status');
CALL sp_serviceflow_add_is_active('suppliers', 'email');
CALL sp_serviceflow_add_is_active('products', 'image_path');

DROP PROCEDURE IF EXISTS sp_serviceflow_add_is_active;

UPDATE customers SET is_active = 1 WHERE is_active IS NULL;
UPDATE service_categories SET is_active = 1 WHERE is_active IS NULL;
UPDATE services SET is_active = 1 WHERE is_active IS NULL;
UPDATE work_orders SET is_active = 1 WHERE is_active IS NULL;
UPDATE financial_transactions SET is_active = 1 WHERE is_active IS NULL;
UPDATE suppliers SET is_active = 1 WHERE is_active IS NULL;
UPDATE products SET is_active = 1 WHERE is_active IS NULL;

