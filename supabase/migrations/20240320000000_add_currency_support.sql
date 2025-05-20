-- Add currency support
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GBP';

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(5) NOT NULL,
  is_default BOOLEAN DEFAULT false
);

-- Insert supported currencies
INSERT INTO currencies (code, name, symbol, is_default) 
VALUES 
  ('GBP', 'British Pound', '£', true),
  ('USD', 'US Dollar', '$', false),
  ('EUR', 'Euro', '€', false)
ON CONFLICT (code) DO NOTHING; 