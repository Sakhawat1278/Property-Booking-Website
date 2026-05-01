-- Create Bookings Table for Rental Reservations and Viewing Requests
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" uuid REFERENCES properties(id) ON DELETE CASCADE,
    "guest_name" text NOT NULL,
    "guest_email" text NOT NULL,
    "guest_phone" text,
    "check_in" date,
    "check_out" date,
    "adults" integer DEFAULT 1,
    "children" integer DEFAULT 0,
    "total_amount" numeric DEFAULT 0,
    "status" text DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED
    "type" text DEFAULT 'BOOKING',   -- BOOKING (Rent) or VIEWING (Sale)
    "created_at" timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT (to make bookings)
CREATE POLICY "Allow public insert bookings" ON "bookings" FOR INSERT WITH CHECK (true);

-- Allow public to SELECT (for testing, restrict later)
CREATE POLICY "Allow public select bookings" ON "bookings" FOR SELECT USING (true);

-- Allow public to UPDATE (for testing, restrict later)
CREATE POLICY "Allow public update bookings" ON "bookings" FOR UPDATE USING (true) WITH CHECK (true);

-- Allow public to DELETE
CREATE POLICY "Allow public delete bookings" ON "bookings" FOR DELETE USING (true);

-- Enable Realtime for bookings
-- (Make sure to enable in Supabase UI Publications as well)
