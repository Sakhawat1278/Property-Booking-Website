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
TO authenticated
USING (public.is_admin());

-- Public can read certain public settings if needed (e.g., branding)
CREATE POLICY "Everyone can read settings" 
ON "system_settings" 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Insert initial empty settings
INSERT INTO "system_settings" (key, value) VALUES 
('general', '{"admin_email": "", "support_phone": ""}'),
('security', '{"mfa_enabled": false, "password_policy": "STANDARD", "session_timeout": "1h"}'),
('notifications', '{"email_alerts": true, "booking_confirmations": true, "lead_notifications": true}'),
('payments', '{"currency": "USD", "gateway": "STRIPE", "tax_rate": "0"}')
ON CONFLICT (key) DO NOTHING;
