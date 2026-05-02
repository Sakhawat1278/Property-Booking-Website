-- Run this in your Supabase SQL Editor to support advanced property information

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS "primaryImage" text,
ADD COLUMN IF NOT EXISTS "slug" text,
ADD COLUMN IF NOT EXISTS "category" text,
ADD COLUMN IF NOT EXISTS "status" text,
ADD COLUMN IF NOT EXISTS "price" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "currency" text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS "address" text,
ADD COLUMN IF NOT EXISTS "city" text,
ADD COLUMN IF NOT EXISTS "neighborhood" text,
ADD COLUMN IF NOT EXISTS "description" text,
ADD COLUMN IF NOT EXISTS "quickDescription" text,
ADD COLUMN IF NOT EXISTS "bedrooms" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "bathrooms" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "totalArea" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "internalAmenities" text,
ADD COLUMN IF NOT EXISTS "externalAmenities" text,
ADD COLUMN IF NOT EXISTS "pricePerSqft" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "estimatedROI" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "rentalYield" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "serviceCharges" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "propertyTax" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "hoaFees" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "mortgageEstimate" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "tenure" text,
ADD COLUMN IF NOT EXISTS "securityDeposit" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "leaseDuration" text,
ADD COLUMN IF NOT EXISTS "utilitiesIncluded" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "petsAllowed" boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS "furnishingStatus" text,
ADD COLUMN IF NOT EXISTS "availableDate" text,
ADD COLUMN IF NOT EXISTS "floorLevel" integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS "totalFloors" integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS "parkingSpaces" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "viewType" text,
ADD COLUMN IF NOT EXISTS "energyRating" text,
ADD COLUMN IF NOT EXISTS "internetType" text,
ADD COLUMN IF NOT EXISTS "coolingSystem" text,
ADD COLUMN IF NOT EXISTS "heatingSystem" text,
ADD COLUMN IF NOT EXISTS "maintenanceFee" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "neighborhoodSafety" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "walkScore" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "transitScore" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "floodRisk" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "fireRisk" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "heatRisk" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "airQuality" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "isVerified" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "rating" numeric DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS "reviewsCount" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "tags" text,
ADD COLUMN IF NOT EXISTS "ownerName" text,
ADD COLUMN IF NOT EXISTS "ownerTitle" text,
ADD COLUMN IF NOT EXISTS "ownerImage" text,
ADD COLUMN IF NOT EXISTS "ownerType" text,
ADD COLUMN IF NOT EXISTS "country" text,
ADD COLUMN IF NOT EXISTS "exteriorGallery" text[],
ADD COLUMN IF NOT EXISTS "livingGallery" text[],
ADD COLUMN IF NOT EXISTS "kitchenGallery" text[],
ADD COLUMN IF NOT EXISTS "owner_id" uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS "created_by" uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- Optional: Create index for faster searching
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public to SELECT
CREATE POLICY "Allow public select" ON properties FOR SELECT USING (true);

-- Allow public to INSERT (for testing, you should restrict this to authenticated users in production)
CREATE POLICY "Allow public insert" ON properties FOR INSERT WITH CHECK (true);

-- Allow public to UPDATE
CREATE POLICY "Allow public update" ON properties FOR UPDATE USING (true) WITH CHECK (true);
