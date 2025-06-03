"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "transaction_admin", label: "Transaction Admin" },
  { value: "user_admin", label: "User Admin" },
  { value: "readonly_admin", label: "Read-only Admin" },
]

const resourceGroups = [
  {
    name: "Users",
    resources: [
      { id: "users.view", name: "View Users" },
      { id: "users.create", name: "Create Users" },
      { id: "users.edit", name: "Edit Users" },
      { id: "users.delete", name: "Delete Users" },
      { id: "users.approve", name: "Approve Users" },
    ],
  },
  {
    name: "Transactions",
    resources: [
      { id: "transactions.view", name: "View Transactions" },
      { id: "transactions.create", name: "Create Transactions" },
      { id: "transactions.approve", name: "Approve Transactions" },
      { id: "transactions.cancel", name: "Cancel Transactions" },
      { id: "transactions.export", name: "Export Transactions" },
    ],
  },
  {
    name: "Reports",
    resources: [
      { id: "reports.view", name: "View Reports" },
      { id: "reports.create", name: "Create Reports" },
      { id: "reports.export", name: "Export Reports" },
      { id: "reports.schedule", name: "Schedule Reports" },
    ],
  },
  {
    name: "System",
    resources: [
      { id: "system.settings", name: "System Settings" },
      { id: "system.logs", name: "View Logs" },
      { id: "system.backup", name: "Backup & Restore" },
      { id: "system.maintenance", name: "Maintenance Mode" },
    ],
  },
]

export function AdminPermissionManagement() {
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  const handleRoleSelect = (value: string) => {
    setSelectedRole(value)
    setOpen(false)

    // In a real app, you would fetch the permissions for this role
    // For now, we'll simulate different permission sets
    if (value === "super_admin") {
      const allPermissions: Record<string, boolean> = {}
      resourceGroups.forEach((group) => {
        group.resources.forEach((resource) => {
          allPermissions[resource.id] = true
        })
      })
      setPermissions(allPermissions)
    } else if (value === "transaction_admin") {
      const transactionPermissions: Record<string, boolean> = {}
      resourceGroups.forEach((group) => {
        group.resources.forEach((resource) => {
          if (resource.id.startsWith("transactions.")) {
            transactionPermissions[resource.id] = true
          } else if (resource.id === "users.view") {
            transactionPermissions[resource.id] = true
          } else {
            transactionPermissions[resource.id] = false
          }
        })
      })
      setPermissions(transactionPermissions)
    } else {
      // Default to no permissions for other roles
      const noPermissions: Record<string, boolean> = {}
      resourceGroups.forEach((group) => {
        group.resources.forEach((resource) => {
          noPermissions[resource.id] = false
        })
      })
      setPermissions(noPermissions)
    }
  }

  const handlePermissionChange = (id: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Management</CardTitle>
        <CardDescription>Configure detailed permissions for each administrative role.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Role</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                {selectedRole ? roles.find((role) => role.value === selectedRole)?.label : "Select a role..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search roles..." />
                <CommandList>
                  <CommandEmpty>No role found.</CommandEmpty>
                  <CommandGroup>
                    {roles.map((role) => (
                      <CommandItem key={role.value} value={role.value} onSelect={handleRoleSelect}>
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedRole === role.value ? "opacity-100" : "opacity-0")}
                        />
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                        {role.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedRole && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Permission Settings</h3>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  Reset to Default
                </Button>
                <Button size="sm">Save Changes</Button>
              </div>
            </div>

            {resourceGroups.map((group) => (
              <div key={group.name} className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">{group.name}</h4>
                  <Separator className="my-2" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {group.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center space-x-2 rounded-md border p-3">
                      <Checkbox
                        id={resource.id}
                        checked={permissions[resource.id] || false}
                        onCheckedChange={(checked) => handlePermissionChange(resource.id, checked as boolean)}
                      />
                      <Label htmlFor={resource.id} className="flex-1 cursor-pointer">
                        {resource.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
