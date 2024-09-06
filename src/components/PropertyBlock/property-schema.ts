import { z } from 'zod';

// Enum schemas


export const PropertyTypeSchema = z.enum([
  'Detached', 'Semi Detached', 'Terraced', 'Flat', 'Studio Flat',
  'Converted Flat', 'Purpose Built', 'Bungalow', 'Corner House',
  'Commercial', 'Other'
]);

export const RoomTypeSchema = z.enum([
  'living room', 'kitchen', 'dining room', 'office', 'laundry room', 
  'garage', 'attic', 'basement', 'playroom', 'guest room', 'mudroom', 
  'sunroom', 'pantry', 'home theater', 'bedroom', 'bathroom', 'other'
]);

export const DocumentTypeSchema = z.enum([
  'Gas Safety Certificate'
  // Add other document types here as needed
]);

export const RenewalFrequencySchema = z.enum([
  'Every Year',
  'Every 2 Years',
  'Every 5 Years',
  'One-time'
]);

export const RentCycleSchema = z.enum(['Monthly', 'Fortnightly', 'Weekly']);

export const BedroomSchema = z.object({
  name: z.string().min(1, "Bedroom name is required"),
  beds: z.number().int().min(1, "Number of beds must be at least 1"),
  rent_price: z.number().min(0, "Rent price must be a positive number")
});
export type Bedroom = z.infer<typeof BedroomSchema>;


export const PropertySchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().transform((str) => new Date(str)),
 
  
  property_type: PropertyTypeSchema.nullable(),
  is_furnished: z.boolean().default(false),
  num_bathrooms: z.number().int().nonnegative().default(0),
  is_parking_available: z.boolean().default(false),
  is_smoking_allowed: z.boolean().default(false),
  is_pets_allowed: z.boolean().default(false),
  num_floors: z.number().int().positive().default(1),
  address_line_one: z.string(),
  address_line_two: z.string(),
  status: z.enum(['active', 'closed']).default('active'),
  post_code: z.string(),
  city: z.string(),
  state_province_county: z.string(),
  country: z.string(),
  rent_price: z.number().min(0),
  rent_cycle: RentCycleSchema.default('Monthly'),
  security_deposit: z.number().min(0).default(0),
  request_pii: z.boolean().default(false),
  description: z.string().nullable(),
  created_by: z.string().uuid(),
  capacity: z.number().int().positive().default(1),
  is_application_available: z.boolean().default(true),
  available_from: z.string().nullable().transform((str) => str ? new Date(str) : null),
});

export type Property = z.infer<typeof PropertySchema>;

// Rooms schema
export const RoomSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  room_type: RoomTypeSchema,
  custom_name: z.string().optional(),
  created_at: z.date()
});

// Amenities schema
export const AmenitySchema = z.object({
  id: z.string().uuid(),
  name: z.string()
});

// Property-Amenity relationship schema
export const PropertyAmenitySchema = z.object({
  property_id: z.string().uuid(),
  amenity_id: z.string().uuid()
});

// Property Photos schema
export const PropertyPhotoSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  file_name: z.string(),
  file_path: z.string(),
  file_type: z.enum(['jpeg', 'jpg', 'png']),
  file_size: z.number().int().positive(),
  storage_bucket: z.string(),
  is_primary: z.boolean().default(false),
  display_order: z.number().int().optional(),
  upload_date: z.date()
});

// Compliance Documents schema
export const ComplianceDocumentSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  document_type: DocumentTypeSchema,
  expiry_date: z.date(),
  renewal_frequency: RenewalFrequencySchema,
  file_name: z.string().optional(),
  file_path: z.string().optional(),
  upload_date: z.date()
});