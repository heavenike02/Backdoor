import { z } from 'zod';

const applicantSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().nonempty("Date of birth is required"),
    currentAddress: z.string().nonempty("Current address is required"),
    email: z.string().email("Invalid email format"),
    gender: z.string().nonempty("Gender is required"),
    phoneNumber: z.string().nonempty("Phone number is required"),
    employmentType: z.string().nonempty("Employment type is required"),
    rentalHistory: z.object({
        landlordName: z.string().nonempty("Landlord's name is required"),
        phoneNumber: z.string().nonempty("Landlord's phone number is required"),
        address: z.string().nonempty("Landlord's address is required"),
        email: z.string().email("Invalid email format"),
        reference: z.custom<File>((v) => 
            v instanceof File && (v.type === 'application/pdf' || v.type.startsWith('image/')), {
                message: "Reference must be a PDF or an image file",
            }),
        moveInDate: z.string().optional(),
        moveOutDate: z.string().optional(),
    }).optional(),
    employment: z.object({
        name: z.string().optional(),
        address: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().email("Invalid email format").optional(),
    }).optional(),
    guarantor: z.object({
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().email("Invalid email format").optional(),
    }).optional(),
});

export const formSchema = z.object({
    propertyId: z.string().nonempty("Property ID is required"),
    occupantsCount: z.number().min(1, "At least one occupant is required"),
    desiredMoveInDate: z.string().nonempty("Desired move-in date is required"),
    pets: z.string().optional(),
    petDetails: z.string().optional(),
    applicants: z.array(applicantSchema),
});
