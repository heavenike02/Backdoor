
export interface Property {
    id: string;
    created_at: Date;
    organization_id: string;
    property_type: 'Detached' | 'Semi Detached' | 'Terraced' | 'Flat' | 'Studio Flat' | 'Converted Flat' | 'Purpose Built' | 'Bungalow' | 'Corner House' | 'Commercial' | 'Other' | null;
    is_furnished: boolean;
    num_bathrooms: number;
    is_parking_available: boolean;
    is_smoking_allowed: boolean;
    is_pets_allowed: boolean;
    num_floors: number;
    address_line_one: string;
    address_line_two: string;
    status: 'active' | 'closed';
    post_code: string;
    city: string;
    state_province_county: string;
    country: string;
    rent_price: number;
    rent_cycle: 'Monthly' | 'Fortnightly' | 'Weekly';
    security_deposit: number;
    request_pii: boolean;
    description: string | null;
    created_by: string;
    capacity: number;
    is_application_available: boolean;
    available_from: Date | null;
  }