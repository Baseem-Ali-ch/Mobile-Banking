"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"
import { logout } from "@/store/slices/authSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RolesPermissionsSettings } from "@/components/admin/settings/roles-permissions-settings"
import { TransactionWorkflowSettings } from "@/components/admin/settings/transaction-workflow-settings"
import { AuditTrailSettings } from "@/components/admin/settings/audit-trail-settings"
import { LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SettingsContent() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState("roles")

  const handleLogout = () => {
    try {
      dispatch(logout())
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/auth/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      })
    }
  }

  return (
    <div className="container px-4 py-6 pb-20 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure system behavior, workflows, and security parameters</p>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="roles" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="workflows">Transaction Workflows</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Configure user roles and their associated permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <RolesPermissionsSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Workflows</CardTitle>
              <CardDescription>Configure approval workflows for different transaction types</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionWorkflowSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail Settings</CardTitle>
              <CardDescription>Configure audit logging and retention policies</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTrailSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
