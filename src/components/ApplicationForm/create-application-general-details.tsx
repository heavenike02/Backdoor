import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/ui/date-picker';


const GeneralInformation = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="occupantsCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Occupants</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="desiredMoveInDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Desired Move-In Date</FormLabel>
            <FormControl>
              <DatePicker
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date: Date | undefined) => field.onChange(date ? date.toISOString() : '')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pets"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any Pets?</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {form.watch('pets') === 'yes' && (
        <FormField
          control={form.control}
          name="petDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify your pets</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export {GeneralInformation};
