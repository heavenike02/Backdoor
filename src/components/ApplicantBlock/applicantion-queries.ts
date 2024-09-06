'use server';
import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import { ApplicationSchema, type Application } from './application-schema';
export async function fetchApplicationsByOrganizationId(
  organizationId: string,
): Promise<Application[]> {
  const supabase = createSupabaseUserServerActionClient();
  try {
    const { data: applications, error } = await supabase
      .from('property_applications')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) throw error;

    // Return an empty array if properties is null or undefined
    return applications
      ? applications.map((app) => ApplicationSchema.parse(app))
      : [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}
