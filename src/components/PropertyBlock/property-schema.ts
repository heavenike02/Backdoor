import { z } from 'zod';

// Enum schemas
export const PropertyTypeSchema = z.enum(['Unit', 'Complex']);

export const StandalonePropertyTypeSchema = z.enum([
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



export const PropertySchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().transform((str) => new Date(str)),
  organization_id: z.string().uuid(),
  property_type: z.enum(['Unit', 'Complex']),
  Unit_property_type: z.enum([
    'Detached', 'Semi Detached', 'Terraced', 'Flat', 'Studio Flat',
    'Converted Flat', 'Purpose Built', 'Bungalow', 'Corner House',
    'Commercial', 'Other'
  ]).nullable(),
  is_furnished: z.boolean(),
  num_bathrooms: z.number().int().nonnegative(),
  num_bedrooms: z.number().int().nonnegative(),
  area_size_sqft: z.number().int().nonnegative(),
  num_floors: z.number().int().positive(),
  address_line_one: z.string(),
  address_line_two: z.string().nullable(),
  status: z.enum(['active', 'closed']),
  post_code: z.string(),
  city: z.string(),
  state_province_county: z.string().nullable(),
  country: z.string(),
  description: z.string().nullable(),
  created_by: z.string().uuid()
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