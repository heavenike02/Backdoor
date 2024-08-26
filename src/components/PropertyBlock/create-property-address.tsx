import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Assuming you have a CountrySelect component
import { CountrySelect } from '@/components/ui/country-select';

const property_typeOptions = [
  { label: "Detached", value: "Detached" },
  { label: "Semi Detached", value: "Semi Detached" },
  { label: "Terraced", value: "Terraced" },
  { label: "Flat", value: "Flat" },
  { label: "Studio Flat", value: "Studio Flat" },
  { label: "Converted Flat", value: "Converted Flat" },
  { label: "Purpose Built", value: "Purpose Built" },
  { label: "Bungalow", value: "Bungalow" },
  { label: "Corner House", value: "Corner House" },
  { label: "Commercial", value: "Commercial" },
];

export const StepOne = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="address_line_one"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line One</FormLabel>
            <FormControl>
              <Input className="w-full" placeholder="Please enter the first line of the address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address_line_two"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line Two</FormLabel>
            <FormControl>
              <Input className="w-full" placeholder="Please enter the second line of the address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <FormField
          control={form.control}
          name="post_code"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Post Code</FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="Please enter the post code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="Please enter the city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <CountrySelect
                  className="w-full"
                  onChange={(value) => form.setValue("country", value)}
                  priorityOptions={["IE", "UK"]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state_province_county"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>State/Province/County</FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="Please enter the State..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="property_type"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Property Type</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full sm:max-w-[315px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? property_typeOptions.find(
                          (item) => item.value === field.value
                        )?.label
                      : "Select property type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-[275px] p-0">
                <Command>
                  <CommandInput placeholder="Search property type..." />
                  <CommandEmpty>Property type not found.</CommandEmpty>
                  <CommandGroup>
                    {property_typeOptions.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          form.setValue("property_type", item.value)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                className="w-full" 
                placeholder="Please enter a description of the property" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};