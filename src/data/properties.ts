export interface Property {
  id: string;
  title: string;
  slug: string;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'LUXURY' | 'VACATION';
  status: 'FOR_SALE' | 'FOR_RENT' | 'OFF_PLAN';
  price: number;
  currency: string;
  description: string;
  quickDescription?: string;
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  internalAmenities: string;
  externalAmenities: string;
  // Advanced Financials & Sales
  pricePerSqft?: number;
  estimatedROI?: number;
  rentalYield?: number;
  serviceCharges?: number;
  propertyTax?: number;
  hoaFees?: number;
  mortgageEstimate?: number;
  tenure?: 'FREEHOLD' | 'LEASEHOLD';

  // Rental Specifics
  securityDeposit?: number;
  leaseDuration?: string;
  utilitiesIncluded?: boolean;
  petsAllowed?: boolean;
  furnishingStatus?: 'UNFURNISHED' | 'SEMI' | 'FULLY';
  availableDate?: string;

  // Building & Specs
  floorLevel?: number;
  totalFloors?: number;
  parkingSpaces?: number;
  viewType?: string;
  energyRating?: string;
  internetType?: string;
  coolingSystem?: string;
  heatingSystem?: string;
  maintenanceFee?: number;
  
  // Analytics
  neighborhoodSafety?: number;
  walkScore?: number;
  transitScore?: number;
  floodRisk?: number;
  fireRisk?: number;
  heatRisk?: number;
  airQuality?: number;
  
  // Location & Metadata
  address: string;
  city: string;
  neighborhood: string;
  country?: string;
  nearbySchools?: string;
  roomBreakdown?: string;
  yearBuilt?: number;
  tags: string;

  // Visuals
  primaryImage: string;
  imageGallery: string; // Legacy field
  exteriorGallery?: string[];
  livingGallery?: string[];
  kitchenGallery?: string[];

  // Ownership
  ownerName?: string;
  ownerTitle?: string;
  ownerImage?: string;
  ownerType?: 'INDIVIDUAL' | 'AGENCY';

  // System
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  created_at?: string;
  updated_at?: string;
}

export const properties: Property[] = [];
