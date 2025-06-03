"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { UserStatus } from "@/types"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setDetailPanelOpen, updateUserNote } from "@/store/slices/userManagementSlice"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// Status badge component
const StatusBadge = ({ status }: { status: UserStatus }) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return <Badge variant="success">Active</Badge>
    case UserStatus.INACTIVE:
      return <Badge variant="secondary">Inactive</Badge>
    case UserStatus.SUSPENDED:
      return <Badge variant="destructive">Suspended</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

// Verification status badge component
const VerificationBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "verified":
      return <Badge variant="success">Verified</Badge>
    case "pending":
      return <Badge variant="secondary">Pending</Badge>
    case "under_review":
      return <Badge variant="warning">Under Review</Badge>
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function UserDetailPanel() {
  const dispatch = useAppDispatch()
  const userManagementState = useAppSelector((state) => state.userManagement)

  // Local state as fallback
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState("")

  // Try to get state from Redux, but use local state as fallback
  const isDetailPanelOpen = userManagementState?.isDetailPanelOpen || isOpen
  const selectedUser = userManagementState?.selectedUser || null
  const userBankAccounts = userManagementState?.userBankAccounts?.items || []
  const userActivityLog = userManagementState?.userActivityLog?.items || []

  const handleClose = () => {
    if (userManagementState) {
      dispatch(setDetailPanelOpen(false))
    } else {
      setIsOpen(false)
    }
  }

  const handleUpdateNotes = () => {
    if (userManagementState && selectedUser) {
      dispatch(updateUserNote({ userId: selectedUser.id, notes }))
    }
  }

  if (!selectedUser) return null

  return (
    <Sheet open={isDetailPanelOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>
            User Profile: {selectedUser.firstName} {selectedUser.lastName}
          </SheetTitle>
          <SheetDescription>
            User ID: {selectedUser.id} | Status: <StatusBadge status={selectedUser.status} />
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Full Name:</span>
                    <span>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Email:</span>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Phone:</span>
                    <span>{selectedUser.phoneNumber}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Registration Date:</span>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Last Login:</span>
                    <span>{formatDate(selectedUser.lastLogin)}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Last Activity:</span>
                    <span>{formatDate(selectedUser.lastActivity)}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">2FA Enabled:</span>
                    <span>{selectedUser.twoFactorEnabled ? "Yes" : "No"}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Status:</span>
                    <span>
                      <StatusBadge status={selectedUser.status} />
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Role:</span>
                    <span>{selectedUser.role}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Verification Status:</span>
                    <span>
                      <VerificationBadge status={selectedUser.verificationStatus} />
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">KYC Status:</span>
                    <span>{selectedUser.kycStatus}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Risk Level:</span>
                    <span>{selectedUser.riskLevel}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Linked Accounts:</span>
                    <span>{selectedUser.linkedAccounts}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Transaction Count:</span>
                    <span>{selectedUser.transactionCount}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Transaction Volume:</span>
                    <span>${selectedUser.transactionVolume?.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Notification Preferences</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">Transactions:</span>
                      <Badge variant={selectedUser.notificationPreferences?.transactions ? "success" : "secondary"}>
                        {selectedUser.notificationPreferences?.transactions ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">Balance Updates:</span>
                      <Badge variant={selectedUser.notificationPreferences?.balanceUpdates ? "success" : "secondary"}>
                        {selectedUser.notificationPreferences?.balanceUpdates ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">Security Alerts:</span>
                      <Badge variant={selectedUser.notificationPreferences?.securityAlerts ? "success" : "secondary"}>
                        {selectedUser.notificationPreferences?.securityAlerts ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">Marketing:</span>
                      <Badge variant={selectedUser.notificationPreferences?.marketing ? "success" : "secondary"}>
                        {selectedUser.notificationPreferences?.marketing ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">App Preferences</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">Language:</span>
                      <span>{selectedUser.appPreferences?.language}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">Theme:</span>
                      <span className="capitalize">{selectedUser.appPreferences?.theme}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">Default Currency:</span>
                      <span>{selectedUser.appPreferences?.defaultCurrency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button variant="default">Edit User</Button>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Bank Accounts</h3>
              {userBankAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No bank accounts found for this user.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBankAccounts.map((account) => (
                    <Card key={account.id} className="p-4 border-l-4 border-l-primary">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{account.accountName}</h4>
                          <p className="text-sm text-muted-foreground">{account.bankName}</p>
                        </div>
                        <Badge variant={account.verificationStatus === "verified" ? "success" : "secondary"}>
                          {account.verificationStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="font-medium">Account Number:</span> {account.accountNumber}
                        </div>
                        <div>
                          <span className="font-medium">Routing Number:</span> {account.routingNumber}
                        </div>
                        <div>
                          <span className="font-medium">Account Type:</span> {account.accountType}
                        </div>
                        <div>
                          <span className="font-medium">Balance:</span> {account.currency}{" "}
                          {account.balance.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {account.status}
                        </div>
                        <div>
                          <span className="font-medium">Default:</span> {account.isDefault ? "Yes" : "No"}
                        </div>
                      </div>
                      {account.documents && account.documents.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-sm mb-1">Verification Documents</h5>
                          <div className="space-y-1">
                            {account.documents.map((doc) => (
                              <div key={doc.id} className="flex justify-between items-center text-sm">
                                <span>
                                  {doc.type} ({formatDate(doc.uploadedAt)})
                                </span>
                                <div className="flex items-center gap-2">
                                  <Badge variant={doc.status === "verified" ? "success" : "secondary"}>
                                    {doc.status}
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Reject
                        </Button>
                        <Button variant="default" size="sm">
                          Verify
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Activity Timeline</h3>
              {userActivityLog.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No activity found for this user.</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6 relative">
                    {userActivityLog.map((activity) => (
                      <div key={activity.id} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary" />
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.action}</h4>
                            <span className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</span>
                          </div>
                          <p className="text-sm">{activity.details}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {activity.ipAddress} • {activity.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Admin Notes</h3>
              <Textarea
                placeholder="Add notes about this user..."
                className="min-h-[200px]"
                value={selectedUser.notes || notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleUpdateNotes}>Save Notes</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
