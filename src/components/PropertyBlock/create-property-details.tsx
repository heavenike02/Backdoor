import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BedDouble, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";


import { DatePicker } from '@/components/ui/date-picker';
// You can modify this enum as needed
const rentCycleOptions = [
  { value: "Weekly", label: "Weekly" },
  { value: "Fortnightly", label: "Fortnightly" },
  { value: "Monthly", label: "Monthly" },

];

export const StepTwo = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bedrooms"
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
      <FormField
        control={form.control}
        name="rent_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rent Price</FormLabel>
            <FormControl>
              <Input className="w-full"
               type="number" 
              placeholder="Please enter the total rent price of the property" 
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))} 
              />
               
              
            </FormControl>
            <FormDescription>
            Please enter the total rent price of the property per month
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rental_capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupancy</FormLabel>
            <FormControl>
              <Input className="w-full" 
              type="number" 
              placeholder="Enter the maximum number of tenants" 
              {...field} 
              onChange={(e) => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormDescription>
              Enter the maximum number of tenants this property can accommodate
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      </div>

      
      <FormField
        control={form.control}
        name="rent_cycle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rent Cycle</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a rent cycle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {rentCycleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Choose how often the rent should be paid</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="available_from"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Available From</FormLabel>
            <div>
              <DatePicker
                selected={field.value ? new Date(field.value) : undefined} // Use undefined instead of null
                onSelect={(date: Date | undefined) => field.onChange(date ? date.toISOString() : '')}
              />
            </div>
            <FormDescription>
              Select the date from which the property will be available for rent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
       <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <FormField
          control={form.control}
          name="num_floors"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Number of Floors</FormLabel>
              <FormControl>
                <Input className="w-full" type="number" placeholder="Enter the number of floors" {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormDescription>
              
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="num_bathrooms"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Number of Bathrooms</FormLabel>
              <FormControl>
                <Input className="w-full" type="number" placeholder="Enter the number of bathrooms" {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormDescription>
               
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>


      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 rounded-md border p-4">
          <BedDouble className="w-8 h-8 text-muted-foreground" />
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <p className="text-sm font-medium leading-none">Add Bedroom</p>
            <p className="text-sm text-muted-foreground">
              Add a bedroom to the property to screen a tenant against a specific room
            </p>
          </div>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => append({ name: "", beds: 1, rent: 0 })}
            className="w-full sm:w-auto"
          >
            Add Bedroom
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id} className="shadow-sm relative">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => remove(index)}
              className="absolute top-2 right-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader>
              <CardTitle>Bedroom</CardTitle>
              <CardDescription>Add Details for Bedroom {index + 1}</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name={`bedrooms.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedroom Name</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="Bedroom Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-4">
                <FormField
                  control={form.control}
                  name={`bedrooms.${index}.beds`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Number of Beds</FormLabel>
                      <FormControl>
                        <Input className="w-full" 
                        type="number" 
                        placeholder="Number of Beds" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`bedrooms.${index}.rent`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Rent Price</FormLabel>
                      <FormControl>
                        <Input className="w-full" type="number" placeholder="Rent Price" {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};