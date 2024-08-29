'use client'
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SAErrorPayload, SAPayload } from '@/types'
import { useQuery } from 'react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPropertyById } from '../PropertyBlock/property-queries'
import { Property } from '../PropertyBlock/property-types'
import { Separator } from "../ui/separator"

function SkeletonPropertyDetails() {
  return (
    <div className="mb-8">
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>Information about the property you're applying for</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </CardContent>
    </div>
  )
}

export function usePropertyDetails(propertyId: string) {
  
  return useQuery<SAPayload<Property | null>, SAErrorPayload>(
    ['property', propertyId],
    () => fetchPropertyById(propertyId)
  )
}

interface PropertyDetailsProps {
  propertyId: string
}

export function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const { data: propertyDetails, isLoading, isError } = usePropertyDetails(propertyId);

  if (isLoading) return <SkeletonPropertyDetails />;

  if (isError || !propertyDetails || propertyDetails.status === 'error') {
    return <div>Error loading property details.</div>;
  }

  const details = propertyDetails.data!;

  return (
    <div className="mb-8">
  
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between">
          <Label className="font-medium text-muted-foreground">Property Type</Label>
          <p>{details.property_type ?? 'N/A'}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <Label className="font-medium text-muted-foreground">Capacity</Label>
          <p>{details.capacity} occupants</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <Label className="font-medium text-muted-foreground">Bathrooms</Label>
          <p>{details.num_bathrooms}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <Label className="font-medium text-muted-foreground">Floors</Label>
          <p>{details.num_floors}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
            <Label className="font-medium text-muted-foreground">Address</Label>
          <div>
           
            <div>
            <p></p>
            <p></p>
            <p>{details.address_line_one}, {details.address_line_two}, {details.city}, {details.state_province_county} {details.post_code} {details.country}</p> {/* Combined into one line */}
          </div>
           
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <Label className="font-medium text-muted-foreground">Rent</Label>
          <p>${details.rent_price} {details.rent_cycle}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <Label className="font-medium text-muted-foreground">Security Deposit</Label>
          <p>${details.security_deposit}</p>
        </div>
      </div>
    </div>
  )
}