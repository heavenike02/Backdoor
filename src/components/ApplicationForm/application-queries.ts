'use server'
import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import type { FormData } from './application-types';
import { SAPayload } from '@/types';

async function insertApplicant(supabase, data): Promise<SAPayload<string>> {
    const { data: applicant, error } = await supabase
        .from('applicants')
        .insert([{ 
            //user is being created in the backend
            first_name: data.firstName, 
            last_name: data.lastName, 
            email: data.email, 
            phone_number: data.phoneNumber 

        }])
        .single();

    if (error) return { status: 'error', message: error.message }; // Return structured error response
    return { status: 'success', data: applicant.id }; // Return structured success response
}

async function insertApplicantDetails(supabase, applicantId, data): Promise<SAPayload<string>> {
    const { error } = await supabase
        .from('applicant_details')
        .insert([{ 
            
            rental_history: data.rentalHistory, 
            gender: data.gender, 
            date_of_birth: data.dateOfBirth, 
            current_address: data.currentAddress, 
            employment_type: data.employmentType, 

            employer_name: data.employment.name,
            employer_address: data.employment.address,
            employer_phone: data.employment.phoneNumber,
            employer_email: data.employment.email,

            landlord_name: data.rentalHistory.landlordName,
            landlord_phone: data.rentalHistory.phoneNumber,
            landlord_address: data.rentalHistory.address,
            landlord_email: data.rentalHistory.email,
            
            rental_move_in_date: data.rentalHistory.moveInDate,
            rental_move_out_date: data.rentalHistory.moveOutDate,
            rental_reference: data.rentalHistory.reference,
            guarantor_name: data.guarantor.name,
            guarantor_phone: data.guarantor.phoneNumber,
            guarantor_email: data.guarantor.email,
            
        }]);

    if (error) return { status: 'error', message: error.message }; // Return structured error response
    return { status: 'success', data: applicantId }; // Return structured success response
}

async function insertPropertyApplication(supabase, applicantId, data): Promise<SAPayload<string>> {
    const { data: property, error } = await supabase
        .from('property_applications')
        .insert([{ 
            property_id: data.propertyId, 
            applicant_id: applicantId, 
            status: 'pending', 
            desired_move_in_date: data.desiredMoveInDate,
            pets: data.pets,
            pet_details: data.petDetails,
            occupants_count: data.occupantsCount
        }])
        .single();

    if (error) return { status: 'error', message: error.message }; // Return structured error response
    return { status: 'success', data: property.id }; // Return structured success response
}

async function uploadApplicationDocument(supabase, file): Promise<string | null> {
    const { data, error } = await supabase.storage
        .from('application_documents') // replace with your bucket name
        .upload(`publi/${file.name}`, file);

    if (error) {
        console.error('Error uploading file:', error);
        return null; // Return null if upload fails
    }
    return data.Key; // Return the file URL or key
}

async function insertApplicationDocument(supabase, propertyId, data): Promise<SAPayload<string>> {
    const fileUrl = await uploadApplicationDocument(supabase, data.file); // Upload the file

    if (!fileUrl) return { status: 'error', message: 'File upload failed' }; // Handle upload failure

    const { error } = await supabase
        .from('application_documents')
        .insert([{ 
            application_id: propertyId, 
            file_name: data.fileName, 
            file_url: fileUrl, // Use the uploaded file URL

            file_type: data.fileType 
        }]);

    if (error) return { status: 'error', message: error.message }; // Return structured error response
    return { status: 'success', data: propertyId }; // Return structured success response
}

export async function submitApplication(data: FormData): Promise<SAPayload<string>> {
    const supabase = createSupabaseUserServerActionClient();
    const applicantResponse = await insertApplicant(supabase, data);
    if (applicantResponse.status === 'error') return applicantResponse; // Handle error

    const applicantId = applicantResponse.data;
    const detailsResponse = await insertApplicantDetails(supabase, applicantId, data);
    if (detailsResponse.status === 'error') return detailsResponse; // Handle error

    const propertyResponse = await insertPropertyApplication(supabase, applicantId, data);
    if (propertyResponse.status === 'error') return propertyResponse; // Handle error

    const documentResponse = await insertApplicationDocument(supabase, propertyResponse.data, data);
    if (documentResponse.status === 'error') return documentResponse; // Handle error

    return { status: 'success', data: 'Application submitted successfully' }; // Final success response
}


