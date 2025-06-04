"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addAccount,
  updateAccount,
  fetchAccount,
  setDefaultAccount,
  deleteAccount,
} from "@/store/slices/accountsSlice";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountType } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlert } from "../ui/alert-component";

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
];

const accountFormSchema = z.object({
  accountHolderName: z.string().min(2, {
    message: "Account holder name must be at least 2 characters.",
  }),
  accountNumber: z
    .string()
    .min(8, {
      message: "Account number must be at least 8 characters.",
    })
    .max(17, {
      message: "Account number must not exceed 17 characters.",
    })
    .regex(/^\d+$/, {
      message: "Account number must contain only digits.",
    }),
  ifscCode: z
    .string()
    .length(11, {
      message: "IFSC code must be exactly 11 characters.",
    })
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
      message:
        "IFSC code must be in the format: AAAA0XXXXXX (first 4 letters, then 0, then 6 alphanumeric characters).",
    })
    .optional(),
  isDefault: z.boolean().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  id?: string;
}

export function AccountForm({ id }: AccountFormProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const dispatch = useAppDispatch();
  const { selectedAccount, isLoading, error } = useAppSelector(
    (state) => state.accounts
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditMode = !!id;

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchAccount(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedAccount) {
      form.reset({
        accountHolderName: selectedAccount.accountHolderName || "",
        accountNumber: selectedAccount.accountNumber,
        ifscCode: selectedAccount.ifscCode || "",
        isDefault: selectedAccount.isDefault,
      });
    }
  }, [form, isEditMode, selectedAccount]);

  useEffect(() => {
    if (error) {
      showAlert({
        type: "error",
        title: "Error",
        description: error,
      });
    }
  }, [error]);

  const onSubmit = async (data: AccountFormValues) => {
    try {
      if (isEditMode && selectedAccount) {
        await dispatch(updateAccount({ id, ...data })).unwrap();

        if (data.isDefault && !selectedAccount.isDefault) {
          await dispatch(setDefaultAccount(id)).unwrap();
        }

        showAlert({
          type: "success",
          title: "Account updated",
          description: "Your account has been successfully updated.",
        });
      } else {
        const response = await dispatch(
          addAccount({
            ...data,
          })
        ).unwrap();

        showAlert({
          type: "success",
          title: "Account added",
          description:
            response.message || "Your account has been successfully added.",
        });
      }

      router.push("/dashboard/accounts");
    } catch (error) {
      // Error is already handled in the error useEffect
    }
  };

  const handleDelete = async () => {
    if (isEditMode && selectedAccount) {
      try {
        await dispatch(deleteAccount(selectedAccount.id)).unwrap();
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });
        router.push("/dashboard/accounts");
      } catch (error) {
        // Error is already handled in the error useEffect
      }
    }
    setDeleteDialogOpen(false);
  };

  const formatRoutingNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    return digits;
  };

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {isEditMode ? "Edit Account" : "Add Account"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accountHolderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the person who owns this account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter account number"
                    {...field}
                    onChange={(e) => {
                      // Allow only digits
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Your account number is kept secure and only the last 4 digits
                  will be displayed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ifscCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter IFSC code (e.g., HDFC0001234)"
                    {...field}
                    onChange={(e) => {
                      // Convert to uppercase
                      const value = e.target.value.toUpperCase();
                      field.onChange(value);
                    }}
                    maxLength={11}
                  />
                </FormControl>
                <FormDescription>
                  The 11-character IFSC code that identifies your bank branch in
                  India.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="default-account">Set as default account</Label>
              <p className="text-sm text-muted-foreground">
                This account will be used as the default for transactions.
              </p>
            </div>
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="default-account"
                      aria-label="Set as default account"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{isEditMode ? "Update Account" : "Add Account"}</>
              )}
            </Button>

            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="w-full"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            )}
          </div>
        </form>
      </Form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
