"use client"

import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { StatCard } from '../ui/StatsCards/Stats-card'
import { PropertyDataTable } from "./property-data-table"
import Link from "next/link"
import { PlusCircle, DollarSign, Users, CreditCard, Activity } from 'lucide-react'
import { fetchPropertiesByOrganizationId } from "./property-queries"
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '../LoadingSpinner'
import { Skeleton } from '../ui/skeleton'



const PropertyStats = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <StatCard
      title="Total Revenue"
      value="$45,231.89"
      change="+20.1% from last month"
      icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
    />
    <StatCard
      title="Subscriptions"
      value="+2350"
      change="+180.1% from last month"
      icon={<Users className="h-4 w-4 text-muted-foreground" />}
    />
    <StatCard
      title="Sales"
      value="+12,234"
      change="+19% from last month"
      icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
    />
    <StatCard
      title="Active Now"
      value="+573"
      change="+201 since last hour"
      icon={<Activity className="h-4 w-4 text-muted-foreground" />}
    />
  </div>
)

const PropertyTableWrapper = ({ organizationId }: { organizationId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', organizationId],
    queryFn: () => fetchPropertiesByOrganizationId(organizationId),
    
  })
// put loading spinner in the center of the page
  if (isLoading) return <div className= "flex justify-center items-center h-50"><LoadingSpinner /></div>
  if (error) return <div>Error loading properties</div>
  // if no data is returned, show content that there are no properties
  if (!data ) return <div>No properties found</div>
  

  return <PropertyDataTable data={data} />
}

export function PropertyPage({ organizationId }: { organizationId: string }) {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
        <Link href={`/organization/${organizationId}/properties/create`}>
          <Button>
            Create Property
            <PlusCircle className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <PropertyStats />
      <Suspense fallback={<Skeleton className="h-50 w-full" />}>
      <PropertyTableWrapper organizationId={organizationId} />
      </Suspense>
    </div>
  )
}