"use client";
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { StepOne } from './create-property-address';
import { StepTwo } from './create-property-details';
import { StepThree } from './create-property-features';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useSAToastMutation } from '@/hooks/useSAToastMutation';
import { createProperty, createBedroom } from './property-queries';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

const schema = z.object({
    address_line_one: z.string().min(1, "Address line one is required"),
    address_line_two: z.string().min(1, "Address line two is required"),
    post_code: z.string().min(1, "Post code is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    state_province_county: z.string().optional(),
    property_type: z.string().min(1, "Property type is required"),
    description: z.string().optional(),
    num_floors: z.number().min(1, "Number of floors must be at least 1"),
    num_bathrooms: z.number().min(1, "Number of bathrooms must be at least 1"),
    is_furnished: z.boolean().optional(),
    is_pets_allowed: z.boolean().optional(),
    is_smoking_allowed: z.boolean().optional(),
    is_parking_available: z.boolean().optional(),
    rent_price: z.number().min(0, "Rent price must be a positive number"),
    rental_capacity: z.number().min(1, "Rental capacity must be at least 1"),
    rent_cycle: z.string().optional(),
    request_pin: z.boolean().optional(),
    available_from: z.string().optional(),
    bedrooms: z.array(z.object({
      name: z.string().min(1, "Bedroom name is required"),
      beds: z.number().min(1, "Number of beds must be at least 1"),
      rent: z.number().min(0, "Rent price must be a positive number"),
    })).optional(),
  });

export const CreatePropertyForm = ({ organizationId }: { organizationId: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const user = useLoggedInUser();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address_line_one: "",
      address_line_two: "",
      post_code: "",
      city: "",
      country: "",
      state_province_county: "",
      property_type: "",
      description: "",
      num_floors: "",
      num_bathrooms: "",
      is_furnished: false,
      is_pets_allowed: false,
      is_smoking_allowed: false,
      is_parking_available: false,
      rent_price: "",
      rental_capacity: "",
      rent_cycle: "",
      request_pin: false,
      available_from: "",
      bedrooms: [],
    },
  });

  const createPropertyMutation = useSAToastMutation(
    async (data: z.infer<typeof schema>) => {
      if (!data) {
        throw new Error('Form data is missing');
      }
// muti step form i have to default values for the form will fix later
      const propertyResult = await createProperty({
        property: {
          address_line_one: data.address_line_one,
          address_line_two: data.address_line_two,
          post_code: data.post_code,
          city: data.city,
          country: data.country,
          state_province_county: data.state_province_county ?? '',
          property_type: data.property_type as "Detached" | "Semi Detached" | "Terraced" | "Flat" | "Studio Flat" | "Converted Flat" | "Purpose Built" | "Bungalow" | "Corner House" | "Commercial" | "Other" | null,
          description: data.description ?? '',
          num_floors: data.num_floors,
          num_bathrooms: data.num_bathrooms,
          is_furnished: data.is_furnished ?? false,
          is_pets_allowed: data.is_pets_allowed ?? false,
          is_smoking_allowed: data.is_smoking_allowed ?? false,
          is_parking_available: data.is_parking_available ?? false,
          rent_price: data.rent_price,
          capacity: data.rental_capacity,
          rent_cycle: data.rent_cycle as "Monthly" | "Fortnightly" | "Weekly" ?? "Monthly", // Default to "Monthly"
          available_from: data.available_from ? new Date(data.available_from) : new Date(),
          status: 'active',
          organization_id: '',
          security_deposit: 0,
          request_pii: false,
          is_application_available: false
        },
        organizationId,
        userId: user.id
      });

      if (propertyResult.status === 'success' && data.bedrooms) {
        for (const bedroom of data.bedrooms) {
          await createBedroom({
            name: bedroom.name,
            beds: bedroom.beds,
            rent_price: bedroom.rent
          }, propertyResult.data.id);
        }
      }
      return propertyResult;
    },
    {
      loadingMessage: 'Creating property...',
      successMessage: 'Property created successfully!',
      errorMessage: 'Failed to create property',
    }
  );

  const onSubmit = async (data) => {
    console.log('Create Property button pressed with data:', data);
    await createPropertyMutation.mutateAsync(data);
    router.push(`/organization/${organizationId}/properties`);  
  };

  const steps = [
    { title: "Property Address", component: StepOne },
    { title: "Property Details", component: StepTwo },
    { title: "Property Rules", component: StepThree },
  ];

  const nextStep = async () => {
    console.log('Current step before validation:', currentStep);
    const fieldsToValidate = {
        0: ['address_line_one', 'address_line_two', 'post_code', 'city', 'country', 'state_province_county', 'property_type', 'description'],
        1: ['rent_cycle', 'rent_price', 'rental_capacity', 'available_from', 'bedrooms', 'num_floors', 'num_bathrooms'],
        2: ['is_furnished', 'is_pets_allowed', 'is_smoking_allowed', 'is_parking_available']
    };
    
    const result = await form.trigger(fieldsToValidate[currentStep]);
    console.log('Validation result for step', currentStep, ':', result);
    
    if (result) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        console.log('Moving to next step:', currentStep + 1);
    } else {
        console.log('Validation failed for step:', currentStep);
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const CurrentStepComponent = steps[currentStep].component;
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-lg font-bold mb-4">{steps[currentStep].title}</h2>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <CurrentStepComponent form={form} />

                    <div className="flex justify-between mt-6">
                        <div>
                            {currentStep > 0 && (
                                <Button type="button" onClick={prevStep}>
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            )}
                        </div>
                        <div>
                            {currentStep < steps.length - 1 ? (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button disabled={createPropertyMutation.isLoading}>
                                      {createPropertyMutation.isLoading ? 'Creating...' : 'Create Property'}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Confirm Property Creation</DialogTitle>
                                      <DialogDescription>
                                       Are you sure you want to create this property?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose>
                                        <Button type="button" variant="outline">
                                          Cancel
                                        </Button>
                                      </DialogClose>
                                      <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                                        Submit
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};