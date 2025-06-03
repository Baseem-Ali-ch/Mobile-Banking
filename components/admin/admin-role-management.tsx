"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const roles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    usersCount: 2,
    permissions: "All permissions",
  },
  {
    id: "2",
    name: "Transaction Admin",
    description: "Manage and approve transactions",
    usersCount: 5,
    permissions: "Transactions (all), Users (view)",
  },
  {
    id: "3",
    name: "User Admin",
    description: "Manage user accounts and profiles",
    usersCount: 3,
    permissions: "Users (all), Transactions (view)",
  },
  {
    id: "4",
    name: "Read-only Admin",
    description: "View-only access to all system data",
    usersCount: 8,
    permissions: "All resources (view only)",
  },
]

export function AdminRoleManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<(typeof roles)[0] | null>(null)

  const handleEditRole = (role: (typeof roles)[0]) => {
    setEditingRole(role)
    setIsDialogOpen(true)
  }

  const handleCreateRole = () => {
    setEditingRole(null)
    setIsDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>Define and manage administrative roles and their permissions.</CardDescription>
          </div>
          <Button onClick={handleCreateRole}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.usersCount} users</Badge>
                    </TableCell>
                    <TableCell>{role.permissions}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" disabled={role.name === "Super Admin"}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {editingRole ? "Modify the role details and permissions." : "Define a new administrative role."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="Enter role name" defaultValue={editingRole?.name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="Enter role description"
                defaultValue={editingRole?.description || ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Select the permissions for this role. You can configure detailed permissions in the Permissions tab.
                </p>
                <div className="space-y-2">
                  {/* This would be a more complex permission selection UI in a real app */}
                  <p className="text-sm font-medium">Permission groups will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button>{editingRole ? "Update Role" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
