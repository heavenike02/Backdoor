"use server"
import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import { PropertySchema, type Property } from "./property-schema"
import { SAPayload } from '@/types';
import { BedroomSchema, type Bedroom } from "./property-schema"





export async function deletePropertyById(id: string): Promise<SAPayload<string>> {
  const supabase = createSupabaseUserServerActionClient();
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .single();

    if (error) throw error;
    return { status: 'success', data: id };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { status: 'error', message: 'Failed to delete property' };
  }
}

export async function fetchPropertiesByOrganizationId(organizationId: string): Promise<Property[]> {
  const supabase = createSupabaseUserServerActionClient();
  try {
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq('organization_id', organizationId);

    if (error) throw error;

    // Return an empty array if properties is null or undefined
    return properties ? properties.map(prop => PropertySchema.parse(prop)) : [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// create and insert property queries take the proper organization id 
//Database compatibility: Many databases, including those used by Supabase, store dates as strings in ISO 8601 format.

export async function createProperty(
  propertyData: {
    property: Omit<Property, 'id' | 'created_at' | 'created_by'>,
    organizationId: string,
    userId: string
  }
): Promise<SAPayload<{ id: string }>> {
  const supabase = createSupabaseUserServerActionClient();
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert({ 
        ...propertyData.property, 
        organization_id: propertyData.organizationId,
        created_at: new Date().toISOString(),
        created_by: propertyData.userId,
        status: 'active',
        available_from: propertyData.property.available_from ? propertyData.property.available_from.toISOString() : null
      })
      .select('id')
      .single();

    if (error) throw error;

    return { status: 'success', data: { id: data.id } };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { status: 'error', message: 'Failed to create property' };
  }
}

//requies organization id and user id
export async function createBedroom(
  bedroom: Omit<Bedroom, 'id' | 'created_at'>,
  propertyId: string,
  
): Promise<SAPayload<Bedroom>> {
  const supabase = createSupabaseUserServerActionClient();
  try {
    const { data, error } = await supabase
      .from('bedrooms')
      .insert({
        ...bedroom,
        property_id: propertyId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    const createdBedroom = BedroomSchema.parse(data);
    return { status: 'success', data: createdBedroom };
  } catch (error) {
    console.error('Failed to create bedroom:', error);
    return { status: 'error', message: 'Failed to create bedroom' };
  }
} 

export async function fetchPropertyById(id: string): Promise<SAPayload<Property | null>> {
  const supabase = createSupabaseUserServerActionClient();
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { status: 'success', data: property ? PropertySchema.parse(property) : null };
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    return { status: 'error', message: 'Failed to fetch property' };
  }
}