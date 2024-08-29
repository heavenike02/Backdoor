import { useQuery } from 'react-query'
import { fetchPropertyById } from '../components/PropertyBlock/property-queries'
import { Property } from '../components/PropertyBlock/property-types'
import { SAErrorPayload, SAPayload } from '@/types'

export function usePropertyDetails(propertyId: string) {
  return useQuery<SAPayload<Property | null>, SAErrorPayload>(
    ['property', propertyId],
    () => fetchPropertyById(propertyId)
  )
}