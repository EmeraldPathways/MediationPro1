import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DollarSign, Landmark, Home, Car, Trash2, PlusCircle } from "lucide-react"; // Icons

// Sub-schemas for repeatable items
const incomeItemSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z.number().positive("Amount must be positive"),
  frequency: z.enum(["Weekly", "Monthly", "Annually"]).default("Monthly"),
});

const assetItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  value: z.number().positive("Value must be positive"),
});

const liabilityItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amountOwed: z.number().positive("Amount must be positive"),
  creditor: z.string().optional(),
});


// Define the schema for one party's statement of means
const partyMeansSchema = z.object({
  name: z.string().optional(), // Pre-fill ideally
  income: z.array(incomeItemSchema).optional().default([]),
  assets: z.array(assetItemSchema).optional().default([]),
  liabilities: z.array(liabilityItemSchema).optional().default([]),
  notes: z.string().optional(),
});

// Define the schema for the combined statement of means form
const statementOfMeansSchema = z.object({
  statementDate: z.string().optional().default(new Date().toISOString().split('T')[0]),
  partyA: partyMeansSchema,
  partyB: partyMeansSchema,
  sharedNotes: z.string().optional(),
});

type StatementOfMeansData = z.infer<typeof statementOfMeansSchema>;

// Helper component for repeatable fields
interface RepeatableFieldProps<T> {
  control: any; // Control object from useForm
  name: string; // e.g., "partyA.income"
  label: string; // e.g., "Income Source"
  renderFields: (index: number, remove: (index: number) => void) => React.ReactNode;
  newItem: T; // Default object for a new item
  addLabel: string; // e.g., "Add Income Source"
}

function RepeatableField<T>({ control, name, label, renderFields, newItem, addLabel }: RepeatableFieldProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-3">
      <FormLabel>{label}</FormLabel>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start space-x-2 border p-3 rounded-md">
          <div className="flex-grow space-y-2">
            {renderFields(index, remove)}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(index)}
            className="mt-1" // Align button slightly better
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append(newItem)}
        className="mt-2"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}


// TODO: Add props to receive initial party names if available
export function StatementOfMeansForm() {
  const form = useForm<StatementOfMeansData>({
    resolver: zodResolver(statementOfMeansSchema),
    defaultValues: {
      statementDate: new Date().toISOString().split('T')[0],
      partyA: { name: "", income: [], assets: [], liabilities: [], notes: "" },
      partyB: { name: "", income: [], assets: [], liabilities: [], notes: "" },
      sharedNotes: "",
    },
  });

  function onSubmit(data: StatementOfMeansData) {
    console.log("Statement of Means Form Submitted:", data);
    // TODO: Implement saving logic
    toast.success("Statement of Means saved successfully (simulated).");
  }

  // Helper to render party statement section
  const renderPartyMeansSection = (party: 'partyA' | 'partyB', partyLabel: string) => (
    <Accordion type="multiple" className="w-full space-y-3">
      <AccordionItem value={`${party}-details`} className="border rounded-md p-4">
        <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
          {partyLabel} Statement of Means
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-6">
           <FormField
                control={form.control}
                name={`${party}.name`}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input placeholder={`${partyLabel} Name`} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

          {/* Income Section */}
          <RepeatableField
            control={form.control}
            name={`${party}.income`}
            label="Income Sources"
            addLabel="Add Income Source"
            newItem={{ source: "", amount: 0, frequency: "Monthly" }}
            renderFields={(index, remove) => (
              <>
                <FormField control={form.control} name={`${party}.income.${index}.source`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Source</FormLabel><FormControl><Input placeholder="e.g., Salary, Benefits" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`${party}.income.${index}.amount`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Amount (€)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="Amount" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>)} />
                {/* Add Frequency Dropdown if needed */}
              </>
            )}
          />

          {/* Assets Section */}
           <RepeatableField
            control={form.control}
            name={`${party}.assets`}
            label="Assets"
            addLabel="Add Asset"
            newItem={{ description: "", value: 0 }}
            renderFields={(index, remove) => (
              <>
                <FormField control={form.control} name={`${party}.assets.${index}.description`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Description</FormLabel><FormControl><Input placeholder="e.g., Family Home, Car, Savings" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`${party}.assets.${index}.value`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Estimated Value (€)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="Value" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />

          {/* Liabilities Section */}
           <RepeatableField
            control={form.control}
            name={`${party}.liabilities`}
            label="Liabilities / Debts"
            addLabel="Add Liability"
            newItem={{ description: "", amountOwed: 0, creditor: "" }}
            renderFields={(index, remove) => (
              <>
                <FormField control={form.control} name={`${party}.liabilities.${index}.description`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Description</FormLabel><FormControl><Input placeholder="e.g., Mortgage, Loan, Credit Card" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`${party}.liabilities.${index}.amountOwed`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Amount Owed (€)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="Amount" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`${party}.liabilities.${index}.creditor`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Creditor (Optional)</FormLabel><FormControl><Input placeholder="e.g., Bank Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />

           <FormField
            control={form.control}
            name={`${party}.notes`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Notes ({partyLabel})</FormLabel>
                <FormControl>
                    <Textarea placeholder={`Any specific notes regarding ${partyLabel}'s financial situation...`} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-md">
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-semibold">Statement of Means</h2>
            <FormField
                control={form.control}
                name="statementDate"
                render={({ field }) => (
                <FormItem className="w-1/3">
                    <FormLabel className="text-xs">Statement Date</FormLabel>
                    <FormControl>
                    <Input type="date" {...field} className="text-xs h-8"/>
                    </FormControl>
                     <FormMessage />
                </FormItem>
                )}
            />
        </div>

        {renderPartyMeansSection('partyA', 'Party A')}
        {renderPartyMeansSection('partyB', 'Party B')}

        <FormField
          control={form.control}
          name="sharedNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shared Financial Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="General notes applicable to the overall financial picture..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Statement of Means</Button>
      </form>
    </Form>
  );
}