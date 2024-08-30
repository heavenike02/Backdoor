
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from '@hookform/resolvers/zod'; // Import Zod resolver
import { Plus, Users, X } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { formSchema } from './application-schema'
import { FormData } from './application-types'
import { PropertyDetails } from "./property-details"
import { useSAToastMutation } from "@/hooks/useSAToastMutation"
import { submitApplication } from "./application-queries"

export function CreateApplicationForm({ propertyId }: { propertyId: string }) {
    const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(formSchema), // Use Zod resolver
        defaultValues: {
            propertyId,
            occupantsCount: 0,
            desiredMoveInDate: '',
            pets: '',
            petDetails: '',
            applicants: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "applicants"
    })

    
    const mutation = useSAToastMutation(
        submitApplication,
        {
            loadingMessage: 'Submitting your application...',
            successMessage: 'Application submitted successfully!',
            errorMessage: 'Failed to submit application.',
            onSuccess: () => {
                // Optionally reset the form or redirect
            },
        }
    );

    const onSubmit = (data: FormData) => {
        mutation.mutate(data);
    };

//deal with errors
    return (
        
        <div className="container mx-auto p-4">
            
            <div className=" mb-6">
                <h1 className="text-4xl font-bold">Rental Application Form</h1>
                <p className="text-lg text-muted-foreground">Complete the form to apply for your new home.</p>
            </div>

            <PropertyDetails propertyId={propertyId} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Application Details</CardTitle>
                        <CardDescription>Please fill out the following information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="occupantsCount">Number of Occupants</Label>
                                <Input
                                    type="number"
                                    id="occupantsCount"
                                    {...register('occupantsCount', {
                                        setValueAs: (value) => Number(value) // Parse string to number
                                    })}
                                />
                                {errors.occupantsCount && <p className="text-red-500">{errors.occupantsCount.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="desiredMoveInDate">Desired Move-in Date</Label>
                                <div className="relative">
                                    <DatePicker
                                        selected={watch('desiredMoveInDate') ? new Date(watch('desiredMoveInDate')) : undefined}
                                        onSelect={(date) => setValue('desiredMoveInDate', date?.toISOString() || '')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="pets">Do you have any pets?</Label>
                            <Select onValueChange={(value) => register('pets').onChange({ target: { value } })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="petDetails">Pet Details (if applicable)</Label>
                            <Textarea id="petDetails" {...register('petDetails')} />
                        </div>
                    </CardContent>
                </Card>

                {fields.map((field, index) => (
                    <Card key={field.id} className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => remove(index)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove Applicant</span>
                        </Button>
                        <CardHeader>
                            <CardTitle>Applicant {index + 1}</CardTitle>
                            <CardDescription>Personal information for applicant {index + 1}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`applicants.${index}.firstName`}>First Name</Label>
                                    <Input id={`applicants.${index}.firstName`} {...register(`applicants.${index}.firstName`)} />
                                </div>
                                <div>
                                    <Label htmlFor={`applicants.${index}.lastName`}>Last Name</Label>
                                    <Input id={`applicants.${index}.lastName`} {...register(`applicants.${index}.lastName`)} />
                                </div>
                                <div>
                                    <Label htmlFor={`applicants.${index}.dateOfBirth`}>Date of Birth</Label>
                                    <DatePicker
                                        selected={watch(`applicants.${index}.dateOfBirth`) ? new Date(watch(`applicants.${index}.dateOfBirth`)) : undefined}
                                        onSelect={(date) => setValue(`applicants.${index}.dateOfBirth`, date ? date.toISOString() : '')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`applicants.${index}.currentAddress`}>Current Address</Label>
                                    <Input id={`applicants.${index}.currentAddress`} {...register(`applicants.${index}.currentAddress`)} />
                                </div>
                                <div>
                                    <Label htmlFor={`applicants.${index}.email`}>Email</Label>
                                    <Input type="email" id={`applicants.${index}.email`} {...register(`applicants.${index}.email`)} />
                                </div>
                                <div>
                                    <Label htmlFor={`applicants.${index}.gender`}>Gender</Label>
                                    <Select onValueChange={(value) => register(`applicants.${index}.gender`).onChange({ target: { value } })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor={`applicants.${index}.phoneNumber`}>Phone Number</Label>
                                    <PhoneInput
                                        international={true}
                                        onChange={(value) => setValue(`applicants.${index}.phoneNumber`, value)}
                                        value={watch(`applicants.${index}.phoneNumber`)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`applicants.${index}.employmentType`}>Employment Type</Label>
                                    <Select onValueChange={(value) => register(`applicants.${index}.employmentType`).onChange({ target: { value } })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">Full-time</SelectItem>
                                            <SelectItem value="part-time">Part-time</SelectItem>
                                            <SelectItem value="self-employed">Self-employed</SelectItem>
                                            <SelectItem value="unemployed">Unemployed</SelectItem>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="retired">Retired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            {field.rentalHistory && (
                                <div className="relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            const newApplicants = [...fields];
                                            delete newApplicants[index].rentalHistory;
                                            append(newApplicants[index]);
                                            remove(index);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove Rental History</span>
                                    </Button>
                                    <h4 className="font-semibold mb-2">Rental History</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`applicants.${index}.rentalHistory.landlordName`}>Landlord Name</Label>
                                            <Input {...register(`applicants.${index}.rentalHistory.landlordName`)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.rentalHistory.phoneNumber`}>Phone Number</Label>
                                            <PhoneInput
                                                international={true}
                                                onChange={(value) => setValue(`applicants.${index}.rentalHistory.phoneNumber`, value)}
                                                value={watch(`applicants.${index}.rentalHistory.phoneNumber`)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.rentalHistory.address`}>Address</Label>
                                            <Input {...register(`applicants.${index}.rentalHistory.address`)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.rentalHistory.email`}>Email</Label>
                                            <Input type="email" {...register(`applicants.${index}.rentalHistory.email`)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.rentalHistory.moveInDate`}>Move In Date</Label>
                                            <DatePicker
                                                selected={watch(`applicants.${index}.rentalHistory.moveInDate`) ? new Date(watch(`applicants.${index}.rentalHistory.moveInDate`)!) : undefined}
                                                onSelect={(date) => setValue(`applicants.${index}.rentalHistory.moveInDate`, date ? date.toISOString() : '')}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.rentalHistory.moveOutDate`}>Move Out Date</Label>
                                            <DatePicker
                                                selected={watch(`applicants.${index}.rentalHistory.moveOutDate`) ? new Date(watch(`applicants.${index}.rentalHistory.moveOutDate`)!) : undefined}
                                                onSelect={(date) => setValue(`applicants.${index}.rentalHistory.moveOutDate`, date ? date.toISOString() : '')}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor={`applicants.${index}.rentalHistory.reference`}>Reference</Label>
                                            <Input type="file" accept="application/pdf, image/*" {...register(`applicants.${index}.rentalHistory.reference`)} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!field.rentalHistory && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const newApplicants = [...fields];
                                        newApplicants[index].rentalHistory = {
                                            landlordName: '',
                                            phoneNumber: '',
                                            address: '',
                                            email: '',
                                            moveInDate: '',
                                            moveOutDate: '',
                                            reference: null,
                                        };
                                        append(newApplicants[index]);
                                        remove(index);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Rental History
                                </Button>
                            )}

                            <Separator />

                            {field.employment && (
                                <div className="relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            const newApplicants = [...fields];
                                            delete newApplicants[index].employment;
                                            append(newApplicants[index]);
                                            remove(index);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove Employment Information</span>
                                    </Button>
                                    <h4 className="font-semibold mb-2">Employment</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`applicants.${index}.employment.name`}>Employer Name</Label>
                                            <Input {...register(`applicants.${index}.employment.name`)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.employment.address`}>Employer Address</Label>
                                            <Input {...register(`applicants.${index}.employment.address`)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.employment.phoneNumber`}>Employer Phone Number</Label>

                                            <PhoneInput
                                                international={true}
                                                onChange={(value) => setValue(`applicants.${index}.employment.phoneNumber`, value)}
                                                value={watch(`applicants.${index}.employment.phoneNumber`)}
                                            />

                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.employment.email`}>Employer Email</Label>
                                            <Input type="email" {...register(`applicants.${index}.employment.email`)} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!field.employment && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const newApplicants = [...fields];
                                        newApplicants[index].employment = { name: '', address: '', phoneNumber: '', email: '' };
                                        append(newApplicants[index]);
                                        remove(index);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Employment Information
                                </Button>
                            )}

                            <Separator />

                            {field.guarantor && (
                                <div className="relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            const newApplicants = [...fields];
                                            delete newApplicants[index].guarantor;
                                            append(newApplicants[index]);
                                            remove(index);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove Guarantor Information</span>
                                    </Button>
                                    <h4 className="font-semibold mb-2">Guarantor</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`applicants.${index}.guarantor.name`}>Name</Label>
                                            <Input {...register(`applicants.${index}.guarantor.name`)} />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.guarantor.phoneNumber`}>Phone Number</Label>
                                            <PhoneInput
                                                international={true}
                                                onChange={(value) => setValue(`applicants.${index}.guarantor.phoneNumber`, value)}
                                                value={watch(`applicants.${index}.guarantor.phoneNumber`)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`applicants.${index}.guarantor.email`}>Email</Label>
                                            <Input type="email" {...register(`applicants.${index}.guarantor.email`)} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!field.guarantor && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const newApplicants = [...fields];
                                        newApplicants[index].guarantor = { name: '', phoneNumber: '', email: '' };
                                        append(newApplicants[index]);
                                        remove(index);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />                                    Add Guarantor Information
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 rounded-md border p-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                        <p className="text-sm font-medium leading-none">Add Applicants</p>
                        <p className="text-sm text-muted-foreground">
                            Add an applicant to the rental application
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => append({
                            firstName: '',
                            lastName: '',
                            dateOfBirth: '',
                            currentAddress: '',
                            email: '',
                            gender: '',
                            phoneNumber: '',
                            employmentType: '',
                        })}
                        className="w-full sm:w-auto"
                    >
                        Add Applicant
                    </Button>
                </div>

                <Button type="submit">Submit Application</Button>
            </form>
        </div>
    )
}