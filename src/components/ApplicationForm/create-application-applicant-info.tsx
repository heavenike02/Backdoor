import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import DatePicker from '@/components/ui/date-picker';

const ApplicantInformation = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "applicants",
  });

  const [showPreviousLandlord, setShowPreviousLandlord] = useState(false);
  const [showEmployment, setShowEmployment] = useState(false);
  const [showGuarantor, setShowGuarantor] = useState(false);

  const renderApplicantFields = (index) => (
    <AccordionItem value={`applicant-${index}`} key={index}>
      <AccordionTrigger>Applicant {index + 1} Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          {/* Basic applicant fields */}
          <FormField
            control={form.control}
            name={`applicants.${index}.firstName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Add other basic fields here */}

          {/* Previous Landlord */}
          <Button onClick={() => setShowPreviousLandlord(!showPreviousLandlord)}>
            {showPreviousLandlord ? 'Remove Previous Landlord' : 'Add Previous Landlord'}
          </Button>
          {showPreviousLandlord && (
            <div className="space-y-4">
              {/* Add Previous Landlord fields here */}
            </div>
          )}

          {/* Employment */}
          <Button onClick={() => setShowEmployment(!showEmployment)}>
            {showEmployment ? 'Remove Employment' : 'Add Employment'}
          </Button>
          {showEmployment && (
            <div className="space-y-4">
              {/* Add Employment fields here */}
            </div>
          )}

          {/* Guarantor */}
          <Button onClick={() => setShowGuarantor(!showGuarantor)}>
            {showGuarantor ? 'Remove Guarantor' : 'Add Guarantor'}
          </Button>
          {showGuarantor && (
            <div className="space-y-4">
              {/* Add Guarantor fields here */}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {fields.map((field, index) => renderApplicantFields(index))}
      </Accordion>
      <Button 
        onClick={() => append({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          currentAddress: '',
          email: '',
          phoneNumber: '',
          previousLandlord: { name: '', phoneNumber: '', currentAddress: '', email: '' },
          employment: { name: '', address: '', phoneNumber: '', email: '' },
          guarantor: { name: '', phoneNumber: '', email: '' },
        })}
      >
        Add Applicant
      </Button>
    </div>
  );
};

export {ApplicantInformation};
