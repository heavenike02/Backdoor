
import {CreatePropertyForm} from "@/components/PropertyBlock/create-property-form"
export default function CreateProperty({
    params,
}: {
    params: { organizationId: string };
}) {
    const { organizationId } = params;
   
    return (
        <div>
            
            <CreatePropertyForm organizationId={organizationId} />
            
        </div>
    )
}