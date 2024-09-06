import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LucideIcon } from "lucide-react"
import { Building2 , User } from "lucide-react";


interface RadioCardProps {
    label: string;
    icon: LucideIcon;
}

const RadioCard = function RadioCard({ label, icon }: RadioCardProps) {
    return (
        <div className="flex items-center p-4 border rounded-lg">
            <icon className="mr-2" />
            <span>{label}</span>
        </div>
    );
}

const RadioCards = function RadioCards() {
    return (
        <RadioGroup>
            <RadioGroupItem value="landlord" id="landlord">
                <RadioCard label="Landlord" icon={Building2} />
            </RadioGroupItem>
            <RadioGroupItem value="tenant" id="tenant">
                <RadioCard label="Tenant" icon={User} />   
            </RadioGroupItem>
        </RadioGroup>
    );
}

export { RadioCards, RadioCard };