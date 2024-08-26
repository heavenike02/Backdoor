import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPropertyById } from '../PropertyBlock/property-queries';
import { Property } from '../PropertyBlock/property-types';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HomeIcon, BedIcon, BathIcon, BuildingIcon, CalendarIcon, CarIcon, DogIcon, MapPinIcon, ShieldIcon } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
interface PropertyDetailsProps {
  propertyId: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyId }) => {
  const { data: propertyDetails, isLoading, error } = useQuery<Property | null>(['property', propertyId], async () => {
    const response = await fetchPropertyById(propertyId);
    if (response.status === 'success') {
      return response.data; // Return the property data
    }
    throw new Error(response.message); // Handle error appropriately
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading property details</div>;
  if (!propertyDetails) return null;

  return (
    <div className="container mx-auto p-2">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Property Details</CardTitle>
            <Badge variant={propertyDetails.status === 'active' ? "default" : "secondary"}>
              {propertyDetails.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <HomeIcon className="h-4 w-4 text-muted-foreground" />
                <span>{propertyDetails.property_type}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BedIcon className="h-4 w-4 text-muted-foreground" />
                <span>Capacity: {propertyDetails.capacity}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BathIcon className="h-4 w-4 text-muted-foreground" />
                <span>Bathrooms: {propertyDetails.num_bathrooms}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <span>Floors: {propertyDetails.num_floors}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Available from: {propertyDetails.available_from?.toDateString() || 'Not specified'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{propertyDetails.is_parking_available ? "Parking available" : "No parking"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <SmokingIcon className="h-4 w-4 text-muted-foreground" />
                <span>{propertyDetails.is_smoking_allowed ? "Smoking allowed" : "No smoking"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <DogIcon className="h-4 w-4 text-muted-foreground" />
                <span>{propertyDetails.is_pets_allowed ? "Pets allowed" : "No pets"}</span>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Address</h3>
            <div className="flex items-start space-x-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p>{propertyDetails.address_line_one}, {propertyDetails.address_line_two}</p>
                <p>{propertyDetails.city}, {propertyDetails.post_code}</p>
                <p>{propertyDetails.state_province_county}, {propertyDetails.country}</p>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Rental Information</h3>
            <div className="flex items-center space-x-2 text-sm">
              <CurrencyPoundIcon className="h-4 w-4 text-muted-foreground" />
              <span>Rent: €{propertyDetails.rent_price} {propertyDetails.rent_cycle}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
              <span>Security Deposit: £{propertyDetails.security_deposit}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { PropertyDetails };