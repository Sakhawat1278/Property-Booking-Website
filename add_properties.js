import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxdeixjbuuzlprxasquc.supabase.co';
const supabaseAnonKey = 'sb_publishable__svdmh9Fvs26zT4w-h2pMw_5YoTbSO1';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addProperties() {
    try {
        console.log('Inserting data with ALL ADVANCED fields...');
        
        const saleImg = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';
        const rentImg = 'https://images.unsplash.com/photo-1600607687940-c52af09239b7?auto=format&fit=crop&w=1600&q=80';

        const properties = [
            {
                title: 'The Sky Palace Penthouse',
                slug: 'sky-palace-penthouse-dubai-' + Date.now(),
                category: 'LUXURY',
                status: 'FOR_SALE',
                price: 12500000,
                currency: 'USD',
                description: 'Experience unparalleled luxury in this sprawling 10,000 sqft penthouse. Featuring 360-degree views of the Dubai skyline, a private infinity pool, and world-class smart home integration. This architectural masterpiece offers the pinnacle of urban living.',
                quickDescription: 'Ultra-luxury 10,000 sqft penthouse with 360-degree skyline views and private infinity pool.',
                bedrooms: 6,
                bathrooms: 8,
                totalArea: 10250,
                address: 'Burj Khalifa District, Unit 9802',
                city: 'Dubai',
                neighborhood: 'Downtown Dubai',
                country: 'UAE',
                primaryImage: saleImg,
                internalAmenities: 'Private Pool, Smart Home, Cinema Room, Wine Cellar, Maid Quarters',
                externalAmenities: '24/7 Security, Valet Parking, Private Lift, Gym, Spa Access',
                isVerified: true,
                rating: 5.0,
                reviewsCount: 12,
                tags: 'Luxury, Penthouse, View, Exclusive',
                pricePerSqft: 1219,
                estimatedROI: 7.5,
                rentalYield: 4.2,
                serviceCharges: 45000,
                propertyTax: 0,
                hoaFees: 2500,
                mortgageEstimate: 55000,
                tenure: 'FREEHOLD',
                floorLevel: 98,
                totalFloors: 163,
                parkingSpaces: 4,
                viewType: 'Burj Khalifa & Sea',
                energyRating: 'A++',
                internetType: 'Fiber 10Gbps',
                coolingSystem: 'District Cooling',
                heatingSystem: 'Central Electric',
                maintenanceFee: 12000,
                neighborhoodSafety: 10,
                walkScore: 95,
                transitScore: 90,
                airQuality: 88,
                ownerName: 'Ali Mansour',
                ownerTitle: 'Senior Partner',
                ownerType: 'AGENCY'
            },
            {
                title: 'Ocean Breeze Garden Villa',
                slug: 'ocean-breeze-villa-malibu-' + Date.now(),
                category: 'RESIDENTIAL',
                status: 'FOR_RENT',
                price: 18500,
                currency: 'USD',
                description: 'A serene coastal sanctuary nestled in the heart of Malibu. This modern villa blends seamless indoor-outdoor living with a private botanical garden and direct beach access. Perfect for long-term stays or high-end relocation.',
                quickDescription: 'Modern Malibu villa with direct beach access, botanical garden, and seamless indoor-outdoor living.',
                bedrooms: 4,
                bathrooms: 4,
                totalArea: 4200,
                address: '24800 Pacific Coast Hwy',
                city: 'Malibu',
                neighborhood: 'Carbon Beach',
                country: 'USA',
                primaryImage: rentImg,
                internalAmenities: 'Gourmet Kitchen, Fireplace, Floor-to-ceiling glass, Hardwood floors',
                externalAmenities: 'Private Garden, Infinity Pool, Outdoor Kitchen, Direct Beach Path',
                isVerified: true,
                rating: 4.9,
                reviewsCount: 28,
                tags: 'Beachfront, Garden, Modern, Quiet',
                securityDeposit: 35000,
                leaseDuration: '1 Year Min',
                utilitiesIncluded: false,
                petsAllowed: true,
                furnishingStatus: 'FULLY',
                availableDate: '2026-06-01',
                floorLevel: 1,
                totalFloors: 2,
                parkingSpaces: 3,
                viewType: 'Pacific Ocean',
                energyRating: 'A',
                internetType: 'Fiber Optic',
                coolingSystem: 'Central Air',
                heatingSystem: 'Solar Hybrid',
                maintenanceFee: 850,
                neighborhoodSafety: 9,
                walkScore: 65,
                transitScore: 40,
                airQuality: 98,
                ownerName: 'Sarah Jenkins',
                ownerTitle: 'Private Owner',
                ownerType: 'INDIVIDUAL'
            }
        ];

        const { data, error } = await supabase
            .from('properties')
            .insert(properties);

        if (error) throw error;
        console.log('Successfully added 2 premium properties to live DB!');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

addProperties();
