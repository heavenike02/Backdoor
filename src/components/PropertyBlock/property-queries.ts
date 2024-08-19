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

    return properties.map(prop => PropertySchema.parse(prop));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// create and insert property queries take the proper organization id 
//Database compatibility: Many databases, including those used by Supabase, store dates as strings in ISO 8601 format.

export async function createProperty(
  property: Omit<Property, 'id' | 'created_at' | 'created_by'>, 
  organizationId: string, 
  userId: string
): Promise<SAPayload<Property>> {
  const supabase = createSupabaseUserServerActionClient();
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert({ 
        ...property, 
        organization_id: organizationId,
        created_at: new Date().toISOString(),
        created_by: userId,
        status: 'active' 
      })
      .select()
      .single();

    if (error) throw error;

    const createdProperty = PropertySchema.parse(data);


  

    return { status: 'success', data: createdProperty };
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

    const createdBedroom = BedroomSchema.parse(data); // Assuming BedroomSchema is defined
    return { status: 'success', data: createdBedroom };
  } catch (error) {
    console.error('Failed to create bedroom:', error);
    return { status: 'error', message: 'Failed to create bedroom' };
  }
}
 