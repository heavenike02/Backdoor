export interface Applicant {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    currentAddress: string;
    email: string;
    gender: string;
    phoneNumber: string;
    employmentType: string;
    rentalHistory?: {
        landlordName: string;
        phoneNumber: string;
        address: string;
        email: string;
        reference: File | null;
        moveInDate?: string; // Changed to optional
        moveOutDate?: string; // Changed to optional
    };
    employment?: {
        name: string;
        address: string;
        phoneNumber: string;
        email: string;
    };
    guarantor?: {
        name: string;
        phoneNumber: string;
        email: string;
    };
}

export interface FormData {
    propertyId: string;
    occupantsCount: number;
    desiredMoveInDate: string;
    pets: string;
    petDetails: string;
    applicants: Applicant[];
}