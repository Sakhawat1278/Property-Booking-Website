-- Create Settings Table for System Configurations
CREATE TABLE IF NOT EXISTS "system_settings" (
    "key" text PRIMARY KEY,
    "value" jsonb,
    "updated_at" timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;

-- Only Admins can manage settings
CREATE POLICY "Admins can manage settings" 
ON "system_settings" 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'ADMIN'
    )
);

-- Public can read certain public settings if needed (e.g., site name)
CREATE POLICY "Everyone can read settings" ON "system_settings" FOR SELECT USING (true);

-- Insert initial default settings
INSERT INTO "system_settings" (key, value) VALUES 
('general', '{"site_title": "Nestory Luxury", "admin_email": "admin@nestory.com", "support_phone": "+1 234 567 890"}'),
('security', '{"mfa_enabled": false, "password_policy": "STRICT", "session_timeout": "30m"}'),
('notifications', '{"email_alerts": true, "booking_confirmations": true, "lead_notifications": true}'),
('payments', '{"currency": "USD", "gateway": "STRIPE", "tax_rate": "5"}')
ON CONFLICT (key) DO NOTHING;
