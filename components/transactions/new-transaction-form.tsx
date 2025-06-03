"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAccounts } from "@/store/slices/accountsSlice"
import { setTransactionDraft } from "@/store/slices/transactionsSlice"
import { ArrowLeft, Loader2, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { NewAccountForm } from "@/components/transactions/new-account-form"
import { formatCurrency, parseCurrencyInput } from "@/lib/currency-utils"
import { TransactionCategory } from "@/types"

const transactionSchema = z
  .object({
    fromAccountId: z.string({
      required_error: "Please select a source account",
    }),
    destinationType: z.enum(["saved", "new"], {
      required_error: "Please select a destination type",
    }),
    toAccountId: z.string().optional(),
    newAccount: z
      .object({
        accountNumber: z
          .string()
          .min(8, {
            message: "Account number must be at least 8 characters",
          })
          .max(17, {
            message: "Account number must not exceed 17 characters",
          })
          .regex(/^\d+$/, {
            message: "Account number must contain only digits",
          })
          .optional(),
        accountHolderName: z
          .string()
          .min(2, {
            message: "Account holder name must be at least 2 characters",
          })
          .optional(),
        bankName: z.string().optional(),
        routingNumber: z
          .string()
          .length(9, {
            message: "Routing number must be exactly 9 digits",
          })
          .regex(/^\d+$/, {
            message: "Routing number must contain only digits",
          })
          .optional(),
        ifscCode: z
          .string()
          .length(11, {
            message: "IFSC code must be exactly 11 characters",
          })
          .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
            message:
              "IFSC code must be in the format: AAAA0XXXXXX (first 4 letters, then 0, then 6 alphanumeric characters)",
          })
          .optional(),
      })
      .optional(),
    amount: z.string().refine((val) => {
      const amount = parseCurrencyInput(val)
      return amount > 0
    }, "Amount must be greater than 0"),
    description: z.string().optional(),
    category: z.nativeEnum(TransactionCategory, {
      required_error: "Please select a category",
    }),
  })
  .refine(
    (data) => {
      if (data.destinationType === "saved") {
        return !!data.toAccountId
      }
      if (data.destinationType === "new") {
        return !!(
          data.newAccount?.accountNumber &&
          data.newAccount?.accountHolderName &&
          data.newAccount?.bankName &&
          data.newAccount?.routingNumber
        )
      }
      return false
    },
    {
      message: "Please provide destination account details",
      path: ["toAccountId"],
    },
  )
  .refine(
    (data) => {
      if (data.destinationType === "saved" && data.fromAccountId === data.toAccountId) {
        return false
      }
      return true
    },
    {
      message: "Source and destination accounts cannot be the same",
      path: ["toAccountId"],
    },
  )

type TransactionFormValues = z.infer<typeof transactionSchema>

interface NewTransactionFormProps {
  preselectedAccountId?: string
}

export function NewTransactionForm({ preselectedAccountId }: NewTransactionFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { accounts, isLoading: isAccountsLoading } = useAppSelector((state) => state.accounts)
  const { isLoading: isTransactionLoading, error } = useAppSelector((state) => state.transactions)
  const [selectedSourceAccount, setSelectedSourceAccount] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    dispatch(fetchAccounts())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error])

  useEffect(() => {
    if (accounts.length > 0 && preselectedAccountId) {
      const account = accounts.find((acc) => acc.id === preselectedAccountId)
      if (account) {
        setSelectedSourceAccount(account)
      }
    }
  }, [accounts, preselectedAccountId])

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      fromAccountId: preselectedAccountId || "",
      destinationType: "saved",
      toAccountId: "",
      amount: "",
      description: "",
      category: TransactionCategory.TRANSFER,
      newAccount: {
        accountNumber: "",
        accountHolderName: "",
        bankName: "",
        routingNumber: "",
        ifscCode: "",
      },
    },
  })

  const destinationType = form.watch("destinationType")
  const fromAccountId = form.watch("fromAccountId")
  const amount = form.watch("amount")

  useEffect(() => {
    if (fromAccountId && accounts.length > 0) {
      const account = accounts.find((acc) => acc.id === fromAccountId)
      if (account) {
        setSelectedSourceAccount(account)
      }
    }
  }, [fromAccountId, accounts])

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      // Set loading state
      setIsSubmitting(true)
      setIsSuccess(false)

      // Store the draft transaction in Redux
      dispatch(
        setTransactionDraft({
          fromAccountId: data.fromAccountId,
          fromIfscCode: selectedSourceAccount?.ifscCode,
          toAccountId: data.destinationType === "saved" ? data.toAccountId : "new",
          toIfscCode: data.destinationType === "new" ? data.newAccount?.ifscCode : undefined,
          newAccount: data.destinationType === "new" ? data.newAccount : undefined,
          amount: parseCurrencyInput(data.amount),
          description: data.description || "",
          category: data.category,
        }),
      )

      // Create a temporary transaction to show in the list immediately
      const tempTransaction = {
        id: `temp-${Date.now()}`,
        userId: "current-user",
        fromAccountId: data.fromAccountId,
        fromIfscCode: selectedSourceAccount?.ifscCode,
        toAccountId: data.destinationType === "saved" ? data.toAccountId : "new",
        toIfscCode: data.destinationType === "new" ? data.newAccount?.ifscCode : undefined,
        amount: parseCurrencyInput(data.amount),
        currency: "USD",
        description: data.description || "Transfer",
        category: data.category,
        status: "PENDING",
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add the temporary transaction to the store
      dispatch({
        type: "transactions/addTemporaryTransaction",
        payload: tempTransaction,
      })

      // Show success state after a brief delay to show loading
      setTimeout(() => {
        setIsSuccess(true)

        // Show success toast
        toast({
          title: "Transaction Successfully Saved",
          description: "Your transaction details have been saved and are ready for confirmation.",
        })

        // Wait a moment to show the success state before navigating
        setTimeout(() => {
          // Reset states
          setIsSubmitting(false)
          setIsSuccess(false)

          // Navigate to confirmation page
          router.push("/dashboard/transfer/confirm")
        }, 1000)
      }, 1500)
    } catch (error) {
      // Reset loading state
      setIsSubmitting(false)
      setIsSuccess(false)

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process transaction. Please try again.",
      })
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    const formattedValue = formatCurrency(value)
    form.setValue("amount", formattedValue)
  }

  const isAmountValid = () => {
    if (!selectedSourceAccount || !amount) return true
    const parsedAmount = parseCurrencyInput(amount)
    return parsedAmount <= selectedSourceAccount.balance
  }

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">New Transfer</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fromAccountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Account</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountName} - {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedSourceAccount && (
            <Card>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-lg font-bold">{formatCurrency(selectedSourceAccount.balance)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Account</p>
                    <p className="font-medium">{selectedSourceAccount.accountName}</p>
                    <p className="text-xs text-muted-foreground">
                      •••• {selectedSourceAccount.accountNumber.slice(-4)}
                    </p>
                    {selectedSourceAccount.ifscCode && (
                      <p className="text-xs text-muted-foreground font-mono">IFSC: {selectedSourceAccount.ifscCode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <FormField
            control={form.control}
            name="destinationType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>To</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="saved" id="saved" />
                      <label
                        htmlFor="saved"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        My Accounts & Saved Beneficiaries
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <label
                        htmlFor="new"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        New Beneficiary
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {destinationType === "saved" && (
            <FormField
              control={form.control}
              name="toAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts
                        .filter((account) => account.id !== fromAccountId)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.accountName} - •••• {account.accountNumber.slice(-4)}
                            {account.ifscCode ? ` (IFSC: ${account.ifscCode})` : ""}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {destinationType === "new" && <NewAccountForm form={form} />}

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      {...field}
                      className={`pl-7 text-right text-lg ${!isAmountValid() ? "border-red-500" : ""}`}
                      placeholder="0.00"
                      onChange={handleAmountChange}
                    />
                  </div>
                </FormControl>
                {!isAmountValid() && <p className="text-sm font-medium text-red-500">Insufficient funds</p>}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TransactionCategory.TRANSFER}>Transfer</SelectItem>
                    <SelectItem value={TransactionCategory.PAYMENT}>Payment</SelectItem>
                    <SelectItem value={TransactionCategory.WITHDRAWAL}>Withdrawal</SelectItem>
                    <SelectItem value={TransactionCategory.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description / Remarks</FormLabel>
                <FormControl>
                  <Textarea placeholder="What's this transfer for?" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>This will be visible to the recipient.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className={`w-full transition-all duration-300 ${isSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
              disabled={isSubmitting || isTransactionLoading || isAccountsLoading || !isAmountValid()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Transaction Saved
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
