'use client';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient
import { useParams } from 'next/navigation'
import { CreateApplicationForm } from '@/components/ApplicationForm/create-application-form'
import {z} from 'zod'

const queryClient = new QueryClient(); // Create an instance of QueryClient

export default function ApplicationPage() {
  const propertyIdSchema = z.string().min(1, 'Property ID is required');
    const Params = useParams(); // Change to avoid destructuring
    // Get the propertyId from the URL 
    const propertyId = Params?.propertyId  // Use optional chaining
    const parsedPropertyId = propertyIdSchema.parse(propertyId);


  return (
    <QueryClientProvider client={queryClient}> {/* Wrap with QueryClientProvider */}
      <div className="container mx-auto p-4">
        <CreateApplicationForm propertyId={parsedPropertyId}  />
      </div>
    </QueryClientProvider>
  );
}