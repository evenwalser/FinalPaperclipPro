-- Add currency support to store settings
CREATE TABLE store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_code VARCHAR(3) NOT NULL DEFAULT 'GBP',
    currency_symbol VARCHAR(1) NOT NULL DEFAULT '£',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update items table to include currency
ALTER TABLE items 
ADD COLUMN currency_code VARCHAR(3) NOT NULL DEFAULT 'GBP';

-- Update transactions table to include currency
ALTER TABLE transactions 
ADD COLUMN currency_code VARCHAR(3) NOT NULL DEFAULT 'GBP';

-- Insert default store settings
INSERT INTO store_settings (currency_code, currency_symbol) 
VALUES ('GBP', '£'); 