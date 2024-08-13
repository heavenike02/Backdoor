import { useSAToastMutation } from '@/hooks/useSAToastMutation';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/createSupabaseUserServerComponentClient';
import { SAPayload } from '@/types';

const deleteProperty = async (Id: string): Promise<SAPayload<string>> => {
  const supabase = createSupabaseUserServerComponentClient();
  const { data, error } = await supabase
    .from('properties')
    .delete()
    .eq('id', Id)
    .single();

  if (error) {
    throw new Error(`Failed to delete property: ${error.message}`);
  }
  return { status: 'success', data: Id };
};

export const useDeletePropertyMutation = () => {
  return useSAToastMutation(deleteProperty, {
    loadingMessage: 'Deleting property...',
    successMessage: 'Property deleted successfully',
    errorMessage: 'Failed to delete property',
  });
};
