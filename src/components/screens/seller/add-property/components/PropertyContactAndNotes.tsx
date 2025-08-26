import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { PropertyFormData } from '../validation/propertySchema';
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import NearbyPlaceFields from "./NearbyPlaceFields";

interface PropertyContactAndNotesProps {
  form: UseFormReturn<PropertyFormData>;
}

const places = ["schools", "hospitals", "malls", "transport"];
const distanceUnits = ["meter", "km"];

export default function PropertyContactAndNotes({
  form,
}: PropertyContactAndNotesProps) {
  const propertyType = form.watch("propertyType");

  return (
    <div className="space-y-6 bg-white rounded-xl shadow p-6 border-t-4 border-orange-500">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
      <FormField
        control={form.control}
        name="contact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md font-semibold text-gray-700">Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Owner/Agent Name" {...field} className="h-[40px] px-3 py-2 text-sm"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md font-semibold text-gray-700">Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="Phone Number" {...field} className="h-[40px] px-3 py-2 text-sm"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md font-semibold text-gray-700">Contact WhatsApp</FormLabel>
            <FormControl>
              <Input placeholder="WhatsApp Number (optional)" {...field} className="h-[40px] px-3 py-2 text-sm"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md font-semibold text-gray-700">Contact Type</FormLabel>
            <select {...field} className="border rounded-lg h-[40px] px-3 py-2 w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="owner">Owner</option>
              <option value="agent">Agent</option>
              <option value="builder">Builder</option>
            </select>
            <FormMessage />
          </FormItem>
        )}
      />

      {(propertyType !== "plot") && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Nearby Places</h3>
          {places.map((place) => (
            <NearbyPlaceFields
              key={place}
              form={form}
              place={place as "schools" | "hospitals" | "malls" | "transport"}
              distanceUnits={distanceUnits}
            />
          ))}
        </>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Additional Notes</h3>
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md font-semibold text-gray-700">Notes</FormLabel>
            <FormControl>
              <Input placeholder="Additional notes" {...field} className="h-[40px] px-3 py-2 text-sm"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
