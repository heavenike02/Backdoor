import {CreatePropertyForm} from "@/components/PropertyBlock/create-property"

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