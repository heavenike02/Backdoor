'use client';

import { useParams } from 'next/navigation'
import { PropertyApplicationForm } from '@/components/ApplicationForm/application-form';

export default function ApplicationPage() {
    const Params = useParams(); // Change to avoid destructuring
    // Get the propertyId from the URL 
    const propertyId = Params?.propertyId; // Use optional chaining


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Application Form for Property {propertyId}</h1>
      <PropertyApplicationForm propertyId={propertyId}></PropertyApplicationForm>
      </div>
  );
}