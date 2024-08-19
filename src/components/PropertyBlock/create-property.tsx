"use client";

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { BedDouble ,X } from "lucide-react";
import { useToastMutation } from "@/hooks/useToastMutation";
import { createProperty } from "./property-queries";
import { serverGetLoggedInUser } from '@/utils/server/serverGetLoggedInUser';
import { createBedroom } from "./property-queries";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PropertyTypeSchema } from "./property-schema";
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "../ui/textarea";
import { CountrySelect } from "@/components/ui/country-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
  address_line_one: z.string().min(1, { message: "Please enter the first line of the address" }).max(255),
  address_line_two: z.string().min(1, { message: "Please enter the second line of the address" }).max(255),
  post_code: z.string().min(1, { message: "Please enter the post code" }).max(255),
  city: z.string().min(1, { message: "Please enter the city" }).max(255),
  property_type: z.string(),
  state_province_county: z.string(),
  country: z.string(),
  description: z.string().min(1).max(255),
  rent_price: z.coerce.number().gte(1).lte(9999999999),
  bedrooms: z.array(z.object({
    name: z.string().min(1).max(255),
    beds: z.coerce.number().gte(1).lte(10),
    rent: z.coerce.number().gte(1).lte(9999999999),
  })).optional()
})

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
]



export function CreatePropertyForm({ organizationId }: { organizationId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address_line_one: "",
      address_line_two: "",
      post_code: "",
      state_province_county: "",
      city: "",
      description: "",
      rent_price: 0,
      bedrooms: []
    },
  })

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bedrooms"
  })

  const createPropertyMutation = useToastMutation(
    async (values: z.infer<typeof formSchema>) => {
      const user = await serverGetLoggedInUser();
  
      // Construct the property data object
      const propertyData = {
        property_type: values.property_type as z.infer<typeof PropertyTypeSchema>,
        is_furnished: false,
        organization_id: organizationId,
        num_bathrooms: 0,
        num_floors: 1,
        address_line_one: values.address_line_one,
        address_line_two: values.address_line_two,
        post_code: values.post_code,
        city: values.city,
        state_province_county: values.state_province_county,
        country: values.country,
        status: 'active' as const,
        rent_price: values.rent_price,
        description: values.description,
       
      };
      const propertyResult = await createProperty(propertyData, organizationId, user.id);
      
      if (propertyResult.status === 'error' || !propertyResult.data) {
        throw new Error('Failed to create property');
      }
  
      // Create bedrooms if they exist
      if (values.bedrooms) {
        for (const bedroom of values.bedrooms) {
          await createBedroom({
            name: bedroom.name,
            beds: bedroom.beds,
            rent_price: bedroom.rent
          }, propertyResult.data.id);
        }
      }
    },
    {
      loadingMessage: 'Creating property...',
      successMessage: 'Property created successfully!',
      errorMessage: 'Failed to create property. Please try again.',
    }
  );
  

 
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    createPropertyMutation.mutate(values);
  }

  return (
    // CHANGE: Added max-width and centered the form
    <div className="w-full max-w-4xl mx-auto p-4">
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          {/* CHANGE: Wrapped in a flex container that stacks on small screens and aligns horizontally on larger screens */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <FormField
              control={form.control}
              name="post_code"
              render={({ field }) => (
                // CHANGE: Added flex-1 to make items equal width on larger screens
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
                // CHANGE: Added flex-1 to make items equal width on larger screens
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

          {/* CHANGE: Wrapped in a flex container that stacks on small screens and aligns horizontally on larger screens */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                // CHANGE: Added flex-1 to make items equal width on larger screens
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
                // CHANGE: Added flex-1 to make items equal width on larger screens
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
                        // CHANGE: Adjusted max-width for small screens
                        className={cn(
                          "w-full sm:max-w-[275px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? property_typeOptions.find(
                            (item) => item.value === field.value
                          )?.label
                          : "Select item"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search property Type..." />
                      <CommandEmpty>Property Type not found.</CommandEmpty>
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
                  <Textarea className="w-full" placeholder="Please enter a description of the property" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rent_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rent Price</FormLabel>
                <FormControl>
                  <Input className="w-full" type="number" placeholder="Please enter the total rent price of the property" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter the total rent price of the property
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 rounded-md border p-4">
              <BedDouble className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <p className="text-sm font-medium leading-none">Add Bedroom</p>
                <p className="text-sm text-muted-foreground">
                  Add a bedroom to the property to invite a tenant to a specific room
                </p>
              </div>
              <Button 
                type="button" 
                onClick={() => append({ name: "", beds: 1, rent: 0 })}
                className="w-full sm:w-auto"
              >
                Add Bedroom
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="shadow-sm relative">
                {/* Updated X button positioning */}
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
                            <Input className="w-full" type="number" placeholder="Number of Beds" {...field} />
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
                            <Input className="w-full" type="number" placeholder="Rent Price" {...field} />
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

          <Button className="w-full sm:w-auto" type="submit">Create Property</Button>
        </form>
      </Form>
    </div>
  )
}
