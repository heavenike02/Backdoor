import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {PropertyDetails} from './create-application-property-details';
import {GeneralInformation} from './create-application-general-details';
import {ApplicantInformation} from './create-application-applicant-info';

export const PropertyApplicationForm = ({ propertyId }) => {
  const [step, setStep] = useState(1);
//type for to see if studnet or employee or unemployed
  const form = useForm({
    defaultValues: {
      propertyId,
      occupantsCount: 0,
      desiredMoveInDate: '',
      pets: '',
      petDetails: '',
      applicants: [
        {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          currentAddress: '',
          email: '',
          gender: '',
          phoneNumber: '',
          employmentType: '',
          previousLandlord: {
            name: '',
            phoneNumber: '',
            currentAddress: '',
            email: '',
            reference: '',
          },
          employment: {
            name: '',
            address: '',
            phoneNumber: '',
            email: '',
          },
          guarantor: {
            name: '',
            phoneNumber: '',
            email: '',
          },
        },
      ],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send the data to your backend
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <>
            <PropertyDetails propertyId={propertyId} />
            <Button onClick={nextStep}>Apply</Button>
          </>
        )}
        {step === 2 && (
          <>
            <GeneralInformation form={form} />
            <Button onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </>
        )}
        {step === 3 && (
          <>
            <ApplicantInformation form={form} />
            <Button onClick={prevStep}>Back</Button>
            <Button type="submit">Submit Application</Button>
          </>
        )}
      </form>
    </Form>
  );
};