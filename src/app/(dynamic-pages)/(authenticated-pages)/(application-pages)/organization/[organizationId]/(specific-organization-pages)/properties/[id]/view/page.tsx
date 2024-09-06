import { ApplicantionView } from "@/components/ApplicantBlock/appplicantion-view";
export default function CreateProperty({
    params,
}: {
    params: { organizationId: string };
}) {
    const { organizationId } = params;
   
    return (
        <div>
            
            <ApplicantionView organizationId={organizationId} />
            
        </div>
    )
}