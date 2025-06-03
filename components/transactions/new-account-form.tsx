"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UseFormReturn } from "react-hook-form"

// List of banks for the dropdown
const BANKS = [
  "Bank of America",
  "Chase",
  "Citibank",
  "Wells Fargo",
  "Capital One",
  "TD Bank",
  "US Bank",
  "PNC Bank",
  "HSBC",
  "Other",
]

interface NewAccountFormProps {
  form: UseFormReturn<any>
}

export function NewAccountForm({ form }: NewAccountFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="newAccount.accountHolderName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Holder Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newAccount.accountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter account number"
                {...field}
                onChange={(e) => {
                  // Allow only digits
                  const value = e.target.value.replace(/\D/g, "")
                  field.onChange(value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newAccount.bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Name</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newAccount.routingNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Routing Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter 9-digit routing number"
                {...field}
                onChange={(e) => {
                  // Allow only digits
                  const value = e.target.value.replace(/\D/g, "")
                  field.onChange(value)
                }}
                maxLength={9}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newAccount.ifscCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IFSC Code</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter IFSC code (e.g., HDFC0001234)"
                {...field}
                onChange={(e) => {
                  // Convert to uppercase
                  const value = e.target.value.toUpperCase()
                  field.onChange(value)
                }}
                maxLength={11}
              />
            </FormControl>
            <FormDescription>The 11-character IFSC code that identifies your bank branch in India.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
