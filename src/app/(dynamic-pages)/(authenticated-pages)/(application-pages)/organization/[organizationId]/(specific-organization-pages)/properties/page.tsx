import { Button } from "@/components/ui/button"
import {PropertyPage} from "@/components/PropertyBlock/property-page"
import { z } from 'zod';



export default function Properties({
  params,
}: {
  params: { organizationId: string };
}) {
  const { organizationId } = params;

  return (
    <div>
      <PropertyPage organizationId={organizationId} />
      
    </div>
  )
}