"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MoreHorizontal, Search, Check, Edit, Trash } from "lucide-react"
import {
  createRole,
  updateRole,
  deleteRole,
  updateAdminUser,
  type Role,
  type Permission,
} from "@/store/slices/settingsSlice"

export function RolesPermissionsSettings() {
  const dispatch = useAppDispatch()
  const roles = useAppSelector((state) => state.settings.roles.items)
  const permissions = useAppSelector((state) => state.settings.permissions.items)
  const adminUsers = useAppSelector((state) => state.settings.adminUsers.items)

  const [activeTab, setActiveTab] = useState("roles")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)

  // Form state for role creation/editing
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Group permissions by category
  const permissionsByCategory = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const handleCreateRole = () => {
    setCurrentRole(null)
    setRoleForm({
      name: "",
      description: "",
      permissions: [],
    })
    setIsRoleDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setCurrentRole(role)
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.id),
    })
    setIsRoleDialogOpen(true)
  }

  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteRole = async () => {
    if (roleToDelete) {
      await dispatch(deleteRole(roleToDelete))
      setIsDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const handlePermissionToggle = (permissionId: string) => {
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permissionId)
      if (exists) {
        return {
          ...prev,
          permissions: prev.permissions.filter((id) => id !== permissionId),
        }
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId],
        }
      }
    })
  }

  const handleRoleSubmit = async () => {
    if (currentRole) {
      await dispatch(
        updateRole({
          id: currentRole.id,
          roleData: roleForm,
        }),
      )
    } else {
      await dispatch(createRole(roleForm))
    }
    setIsRoleDialogOpen(false)
  }

  const handleUpdateUserRole = async (userId: string, roleId: string) => {
    await dispatch(
      updateAdminUser({
        id: userId,
        userData: { role: { id: roleId } as Role },
      }),
    )
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAdminUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Roles & Permissions Management</CardTitle>
            <CardDescription>Create and manage admin roles with granular permissions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateRole}>
              <Plus className="mr-2 h-4 w-4" />
              New Role
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="users">Admin Users</TabsTrigger>
          </TabsList>

          <TabsContent value="roles">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No roles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.length > 3 ? (
                              <>
                                {role.permissions.slice(0, 2).map((permission) => (
                                  <Badge key={permission.id} variant="outline">
                                    {permission.name}
                                  </Badge>
                                ))}
                                <Badge variant="outline">+{role.permissions.length - 2} more</Badge>
                              </>
                            ) : (
                              role.permissions.map((permission) => (
                                <Badge key={permission.id} variant="outline">
                                  {permission.name}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(role.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteRole(role.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdminUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No admin users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdminUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "success" : "secondary"}
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : ""
                            }
                          >
                            {user.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                                Assign Role
                              </DropdownMenuLabel>
                              {roles.map((role) => (
                                <DropdownMenuItem key={role.id} onClick={() => handleUpdateUserRole(user.id, role.id)}>
                                  {user.role.id === role.id && <Check className="mr-2 h-4 w-4" />}
                                  {!user.role || (user.role.id !== role.id && <div className="mr-6" />)}
                                  {role.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Role Creation/Editing Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentRole ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {currentRole ? "Update role details and permissions" : "Define a new role with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                placeholder="e.g. Senior Administrator"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                placeholder="Describe the purpose and scope of this role"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                {Object.entries(permissionsByCategory).map(([category, perms]) => (
                  <div key={category} className="mb-4">
                    <h4 className="mb-2 font-medium">{category}</h4>
                    <div className="grid gap-2">
                      {perms.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={roleForm.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <Label htmlFor={permission.id} className="text-sm font-normal">
                            {permission.name}
                            <span className="ml-1 text-xs text-muted-foreground">- {permission.description}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleSubmit}>{currentRole ? "Update Role" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRole}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
