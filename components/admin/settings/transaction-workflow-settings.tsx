"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Plus, MoreHorizontal, Search, Edit, Trash, AlertCircle } from "lucide-react"
import {
  createTransactionWorkflow,
  updateTransactionWorkflow,
  deleteTransactionWorkflow,
  type TransactionWorkflow,
} from "@/store/slices/settingsSlice"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TransactionWorkflowSettings() {
  const dispatch = useAppDispatch()
  const workflows = useAppSelector((state) => state.settings.transactionWorkflows.items)
  const roles = useAppSelector((state) => state.settings.roles.items)

  const [searchQuery, setSearchQuery] = useState("")
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentWorkflow, setCurrentWorkflow] = useState<TransactionWorkflow | null>(null)
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null)

  // Form state for workflow creation/editing
  const [workflowForm, setWorkflowForm] = useState({
    name: "",
    description: "",
    amountThreshold: 1000,
    requiresApproval: true,
    autoApprovalCriteria: {
      trustedAccountsOnly: false,
      maxAmount: 500,
      userVerificationLevel: ["verified"],
    },
    approvalRoles: [] as string[],
    expirationHours: 24,
  })

  const verificationLevels = [
    { value: "unverified", label: "Unverified" },
    { value: "pending", label: "Pending" },
    { value: "under_review", label: "Under Review" },
    { value: "verified", label: "Verified" },
  ]

  const handleCreateWorkflow = () => {
    setCurrentWorkflow(null)
    setWorkflowForm({
      name: "",
      description: "",
      amountThreshold: 1000,
      requiresApproval: true,
      autoApprovalCriteria: {
        trustedAccountsOnly: false,
        maxAmount: 500,
        userVerificationLevel: ["verified"],
      },
      approvalRoles: [],
      expirationHours: 24,
    })
    setIsWorkflowDialogOpen(true)
  }

  const handleEditWorkflow = (workflow: TransactionWorkflow) => {
    setCurrentWorkflow(workflow)
    setWorkflowForm({
      name: workflow.name,
      description: workflow.description,
      amountThreshold: workflow.amountThreshold,
      requiresApproval: workflow.requiresApproval,
      autoApprovalCriteria: {
        trustedAccountsOnly: workflow.autoApprovalCriteria.trustedAccountsOnly,
        maxAmount: workflow.autoApprovalCriteria.maxAmount,
        userVerificationLevel: workflow.autoApprovalCriteria.userVerificationLevel,
      },
      approvalRoles: workflow.approvalRoles,
      expirationHours: workflow.expirationHours,
    })
    setIsWorkflowDialogOpen(true)
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflowToDelete(workflowId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteWorkflow = async () => {
    if (workflowToDelete) {
      await dispatch(deleteTransactionWorkflow(workflowToDelete))
      setIsDeleteDialogOpen(false)
      setWorkflowToDelete(null)
    }
  }

  const handleRoleToggle = (roleId: string) => {
    setWorkflowForm((prev) => {
      const exists = prev.approvalRoles.includes(roleId)
      if (exists) {
        return {
          ...prev,
          approvalRoles: prev.approvalRoles.filter((id) => id !== roleId),
        }
      } else {
        return {
          ...prev,
          approvalRoles: [...prev.approvalRoles, roleId],
        }
      }
    })
  }

  const handleVerificationLevelToggle = (level: string) => {
    setWorkflowForm((prev) => {
      const exists = prev.autoApprovalCriteria.userVerificationLevel.includes(level)
      if (exists) {
        return {
          ...prev,
          autoApprovalCriteria: {
            ...prev.autoApprovalCriteria,
            userVerificationLevel: prev.autoApprovalCriteria.userVerificationLevel.filter((l) => l !== level),
          },
        }
      } else {
        return {
          ...prev,
          autoApprovalCriteria: {
            ...prev.autoApprovalCriteria,
            userVerificationLevel: [...prev.autoApprovalCriteria.userVerificationLevel, level],
          },
        }
      }
    })
  }

  const handleWorkflowSubmit = async () => {
    if (currentWorkflow) {
      await dispatch(
        updateTransactionWorkflow({
          id: currentWorkflow.id,
          workflowData: workflowForm,
        }),
      )
    } else {
      await dispatch(createTransactionWorkflow(workflowForm))
    }
    setIsWorkflowDialogOpen(false)
  }

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Transaction Workflow Configuration</CardTitle>
            <CardDescription>Define approval workflows, routing rules, and transaction limits</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workflows..."
                className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateWorkflow}>
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount Threshold</TableHead>
                <TableHead>Requires Approval</TableHead>
                <TableHead>Approval Roles</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No workflows found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell>{workflow.description}</TableCell>
                    <TableCell>${workflow.amountThreshold.toLocaleString()}</TableCell>
                    <TableCell>
                      {workflow.requiresApproval ? (
                        <Badge variant="default">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {workflow.approvalRoles.length > 0 ? (
                          workflow.approvalRoles.length > 2 ? (
                            <>
                              {workflow.approvalRoles.slice(0, 1).map((roleId) => {
                                const role = roles.find((r) => r.id === roleId)
                                return (
                                  <Badge key={roleId} variant="outline">
                                    {role ? role.name : roleId}
                                  </Badge>
                                )
                              })}
                              <Badge variant="outline">+{workflow.approvalRoles.length - 1} more</Badge>
                            </>
                          ) : (
                            workflow.approvalRoles.map((roleId) => {
                              const role = roles.find((r) => r.id === roleId)
                              return (
                                <Badge key={roleId} variant="outline">
                                  {role ? role.name : roleId}
                                </Badge>
                              )
                            })
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{workflow.expirationHours} hours</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditWorkflow(workflow)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteWorkflow(workflow.id)}
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
      </CardContent>

      {/* Workflow Creation/Editing Dialog */}
      <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentWorkflow ? "Edit Workflow" : "Create New Workflow"}</DialogTitle>
            <DialogDescription>
              {currentWorkflow
                ? "Update workflow configuration and rules"
                : "Define a new transaction workflow with specific rules"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="grid gap-4 py-4 px-1">
              <div className="grid gap-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={workflowForm.name}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, name: e.target.value })}
                  placeholder="e.g. High Value Transactions"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={workflowForm.description}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, description: e.target.value })}
                  placeholder="Describe the purpose and scope of this workflow"
                  rows={2}
                />
              </div>

              <Separator className="my-2" />

              <div className="grid gap-2">
                <Label htmlFor="amountThreshold">Amount Threshold ($)</Label>
                <Input
                  id="amountThreshold"
                  type="number"
                  value={workflowForm.amountThreshold}
                  onChange={(e) =>
                    setWorkflowForm({ ...workflowForm, amountThreshold: Number.parseFloat(e.target.value) })
                  }
                  placeholder="1000"
                />
                <p className="text-sm text-muted-foreground">
                  Transactions above this amount will follow this workflow
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requiresApproval">Requires Manual Approval</Label>
                <Switch
                  id="requiresApproval"
                  checked={workflowForm.requiresApproval}
                  onCheckedChange={(checked) => setWorkflowForm({ ...workflowForm, requiresApproval: checked })}
                />
              </div>

              {workflowForm.requiresApproval && (
                <div className="grid gap-4 pl-4 border-l-2 border-muted">
                  <div className="grid gap-2">
                    <Label>Approval Roles</Label>
                    <div className="grid gap-2">
                      {roles.map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={workflowForm.approvalRoles.includes(role.id)}
                            onCheckedChange={() => handleRoleToggle(role.id)}
                          />
                          <Label htmlFor={`role-${role.id}`} className="text-sm font-normal">
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {workflowForm.approvalRoles.length === 0 && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>At least one role must be selected for approval</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="expirationHours">Expiration Time (hours)</Label>
                    <Input
                      id="expirationHours"
                      type="number"
                      value={workflowForm.expirationHours}
                      onChange={(e) =>
                        setWorkflowForm({ ...workflowForm, expirationHours: Number.parseInt(e.target.value) })
                      }
                      placeholder="24"
                    />
                    <p className="text-sm text-muted-foreground">
                      Pending transactions will expire after this time period
                    </p>
                  </div>
                </div>
              )}

              <Separator className="my-2" />

              <div className="grid gap-4">
                <h4 className="font-medium">Auto-Approval Criteria</h4>

                <div className="flex items-center justify-between">
                  <Label htmlFor="trustedAccountsOnly">Trusted Accounts Only</Label>
                  <Switch
                    id="trustedAccountsOnly"
                    checked={workflowForm.autoApprovalCriteria.trustedAccountsOnly}
                    onCheckedChange={(checked) =>
                      setWorkflowForm({
                        ...workflowForm,
                        autoApprovalCriteria: {
                          ...workflowForm.autoApprovalCriteria,
                          trustedAccountsOnly: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxAmount">Maximum Auto-Approval Amount ($)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={workflowForm.autoApprovalCriteria.maxAmount}
                    onChange={(e) =>
                      setWorkflowForm({
                        ...workflowForm,
                        autoApprovalCriteria: {
                          ...workflowForm.autoApprovalCriteria,
                          maxAmount: Number.parseFloat(e.target.value),
                        },
                      })
                    }
                    placeholder="500"
                  />
                  <p className="text-sm text-muted-foreground">
                    Transactions below this amount may be auto-approved if other criteria are met
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>User Verification Levels</Label>
                  <div className="grid gap-2">
                    {verificationLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${level.value}`}
                          checked={workflowForm.autoApprovalCriteria.userVerificationLevel.includes(level.value)}
                          onCheckedChange={() => handleVerificationLevelToggle(level.value)}
                        />
                        <Label htmlFor={`level-${level.value}`} className="text-sm font-normal">
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only users with these verification levels will be eligible for auto-approval
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWorkflowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWorkflowSubmit}>{currentWorkflow ? "Update Workflow" : "Create Workflow"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workflow? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteWorkflow}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
