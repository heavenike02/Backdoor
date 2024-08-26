
"use client";
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';

import { Switch } from "@/components/ui/switch";

export const StepThree = ({ form }) => {
  return (
    <div className="space-y-6">
      
      <FormField
        control={form.control}
        name="is_furnished"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Furnished
              </FormLabel>
              <FormDescription>
                Is the property furnished?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_pets_allowed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Pets Allowed
              </FormLabel>
              <FormDescription>
                Are pets allowed in the property?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_smoking_allowed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Smoking Allowed
              </FormLabel>
              <FormDescription>
                Is smoking allowed in the property?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_parking_available"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Parking Available
              </FormLabel>
              <FormDescription>
                Is parking available for the property?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />



          <FormField
              control={form.control}
              name="request_pin"
              render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                          <FormLabel className="text-base">
                              Request Personal Identification Number
                          </FormLabel>
                          <FormDescription>
                              Require tenants to provide a personal identification number
                          </FormDescription>
                      </div>
                      <FormControl>
                          <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                          />
                      </FormControl>
                  </FormItem>
              )}
          />
    </div>
  );
};