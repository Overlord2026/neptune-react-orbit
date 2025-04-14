
import React, { useState } from 'react';
import { TaxReturnData } from '../types/TaxReturnTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { PlusCircle, Trash2 } from 'lucide-react';

interface PersonalInfoStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format XXX-XX-XXXX"),
  filingStatus: z.enum(["single", "married_joint", "married_separate", "head_of_household", "qualifying_widow"], {
    required_error: "Please select a filing status",
  }),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, "ZIP code must be in format XXXXX or XXXXX-XXXX"),
  }),
  dependents: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format XXX-XX-XXXX"),
      relationship: z.string().min(1, "Relationship is required"),
      dateOfBirth: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof personalInfoSchema>;

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onComplete }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      ssn: data.ssn,
      filingStatus: data.filingStatus,
      address: {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        zip: data.address.zip,
      },
      dependents: data.dependents.length > 0 ? data.dependents.map(d => ({
        name: d.name,
        ssn: d.ssn,
        relationship: d.relationship,
        dateOfBirth: d.dateOfBirth
      })) : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dependents",
  });

  function onSubmit(values: FormValues) {
    const formattedData: Partial<TaxReturnData> = {
      firstName: values.firstName,
      lastName: values.lastName,
      ssn: values.ssn,
      filingStatus: values.filingStatus,
      address: {
        street: values.address.street,
        city: values.address.city,
        state: values.address.state,
        zip: values.address.zip,
      },
      dependents: values.dependents.map(dependent => ({
        name: dependent.name,
        ssn: dependent.ssn,
        relationship: dependent.relationship,
        dateOfBirth: dependent.dateOfBirth || new Date().toISOString().split('T')[0]
      })),
    };
    onComplete(formattedData);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Personal Information</h3>
        <p className="text-muted-foreground">Please provide your personal information for your tax return.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
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
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Security Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="XXX-XX-XXXX" />
                  </FormControl>
                  <FormDescription>
                    Format: XXX-XX-XXXX
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filing Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select filing status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Address</h4>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="XXXXX" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Dependents</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", ssn: "", relationship: "" })}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Dependent
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Dependent {index + 1}</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`dependents.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`dependents.${index}.ssn`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SSN</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="XXX-XX-XXXX" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`dependents.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Child" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            {fields.length === 0 && (
              <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
                No dependents added
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfoStep;
